import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import baseUrl from "../../../apis/instance";
import { message } from "antd";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { throttle } from "lodash";

export default function MessageComponent() {
  const { id } = useParams(); // Lấy ID của phòng chat hoặc người bạn từ URL
  const location = useLocation();
  const { friend, roomId } = location.state || {};
  const currentUserId = +localStorage.getItem("userId");
  const otherUserId = +id;
  const currentRoomId = roomId;

  console.log("location.state ", location.state);

  const [nowMessages, setNowMessages] = useState({}); //  Lưu trữ các tin nhắn đang được nhận qua WebSocket.
  const [inputMessage, setInputMessage] = useState(""); // Lưu nội dung tin nhắn nhập từ người dùng
  const [isConnected, setIsConnected] = useState(false); // đánh dấu trạng thái kết nối webSocket
  const [stompClient, setStompClient] = useState(null); // client websocket Stomp
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
  const [listChatHistory, setListChatHistory] = useState([]); //Lưu trữ lịch sử tin nhắn khi lấy từ API

  console.log("listChatHistory: ", listChatHistory);
  console.log("logggfriend:", friend);
  console.log("otherUserId:", otherUserId);
  console.log("currentUserId:", currentUserId);
  console.log("currentRoomId:", currentRoomId);

  // Hàm này tạo một chuỗi duy nhất để xác định ID cuộc hội thoại dựa trên hai ID (userId1 và userId2).
  // Luôn đặt ID nhỏ hơn trước để đảm bảo tính nhất quán (bất kể thứ tự của hai người trong cuộc hội thoại).Ví dụ:
  //createConversationId(1, 2) → "1-2".
  //createConversationId(2, 1) → "1-2".
  const createConversationId = (userId1, userId2) =>
    userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`;

  //----------------------------------------------------------------------------
  //--------Dùng SockJS và STOMP để kết nối đến server WebSocket.---------------
  useEffect(() => {
    //-------A Tạo kết nối SockJS tới server WebSocket (đường dẫn phải được cấu hình trong backend).
    const socket = new SockJS("http://localhost:8080/chat-websocket");

    //-------B Tạo một client STOMP từ thư viện @stomp/stompjs để giao tiếp với server qua giao thức STOMP.
    const client = new Client({
      //1. Cung cấp WebSocket thông qua SockJS đã tạo ở trên.
      webSocketFactory: () => socket,
      debug: (str) => console.log(str), //2. Log thông tin kết nối (cho debug)
      connectHeaders: {}, //3. Headers tùy chọn (trống trong trường hợp này)

      //4. Hàm sẽ được gọi khi kết nối WebSocket thành công.
      onConnect: () => {
        console.log("WebSocket connected");
        setIsConnected(true); // Đánh dấu là đã kết nối
        setStompClient(client); // Lưu client STOMP vào state để có thể sử dụng ở các nơi khác trong component.

        //4.1 Đăng ký một kênh (subscribe) để ------------------LẮNG NGHE TIN NHẮN------------- từ server.
        client.subscribe(
          `/user/${currentUserId}/chat/messages`,
          (messageOutput) => {
            //Parse dữ liệu tin nhắn nhận được từ server (dạng JSON).
            const message = JSON.parse(messageOutput.body);

            // Cập nhật danh sách tin nhắn cho đúng phòng
            // setListChatHistory([...listChatHistory, message]);
            if (message.roomId === currentRoomId) {
              // Chỉ thêm tin nhắn nếu đúng phòng hiện tại
              setNowMessages((prev) => {
                const roomMessages = prev[message.roomId] || [];
                return {
                  ...prev,
                  [message.roomId]: [...roomMessages, message],
                };
              });
            }

            // Cuộn xuống cuối sau khi nhận tin nhắn
            setTimeout(() => {
              scrollToBottom();
            }, 100); // Trì hoãn để DOM có thể cập nhật

            console.log("messgage nhận: ", message);
          }
        );
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
        message.error("Có lỗi xảy ra với kết nối WebSocket.");
      },
      onDisconnect: () => {
        console.log("Disconnected");
        setIsConnected(false); // Đánh dấu là ngắt kết nối
      },
    });
    // Kích hoạt kết nối WebSocket
    client.activate();

    return () => {
      client.deactivate(); // Đảm bảo đóng kết nối khi component bị hủy
    };
  }, [currentUserId, otherUserId, currentRoomId]);

  //----------------------------------------------------------------------------

  //---------------------- Hàm lấy lịch sử chat----------------------------
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadHistory = async (page = 0) => {
    console.log("mess");

    if (!currentUserId || !otherUserId || !currentRoomId) {
      console.error("ID người dùng không hợp lệ");
      setLoading(false);
      return;
    }
    try {
      setLoading(true); // Bật trạng thái loading
      const response = await baseUrl.get(
        `/messages/history/${currentUserId}/${otherUserId}?roomId=${currentRoomId}&page=${page}&size=30`
      );

      const newMessages = response.data.content; // Đảo ngược thứ tự
      setHasMore(!response.data.last); // Kiểm tra còn dữ liệu không

      // Gộp tin nhắn mới với danh sách hiện tại
      setListChatHistory([...newMessages]);

      setCurrentPage(page + 1); // Tăng số trang
    } catch (error) {
      console.error("Không thể tải lịch sử chat:", error);
      message.error("Không thể tải lịch sử chat, vui lòng thử lại.");
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  useEffect(() => {
    // Mỗi khi chuyển sang phòng mới, tải lại danh sách tin nhắn
    setListChatHistory([]); // Xóa danh sách cũ
    loadHistory(0); // Tải dữ liệu của phòng hiện tại
  }, [currentRoomId]); // Khi `currentRoomId` thay đổi, gọi lại hàm này
  //----------------------------------------------------------------------------

  //----------------------  Gửi tin nhắn lên server  ----------------------------

  const sendMessage = () => {
    // 1. Kiểm tra xem WebSocket Client (STOMP client) đã được kết nối hay chưa
    if (!stompClient || !stompClient.connected) {
      console.log("STOMP client chưa kết nối. Vui lòng kiểm tra lại.");
      return;
    }
    // 2. Kiểm tra điều kiện: nội dung tin nhắn không được rỗng
    if (inputMessage.trim() && stompClient && isConnected) {
      // Tạo một đối tượng tin nhắn (chatMessage) chứa các thông tin cần thiết
      const chatMessage = {
        senderId: currentUserId, // ID của người gửi
        receiverId: otherUserId, // ID của người nhận
        content: inputMessage, // Nội dung tin nhắn
        roomId: currentRoomId, // ID của phòng chat
        createdAt: new Date().toISOString(), // Thời gian gửi tin nhắn
      };

      // 4. Gửi tin nhắn qua STOMP client
      try {
        stompClient.publish({
          destination: `/app/chat`, // Kênh server sẽ nhận tin nhắn
          headers: {}, // Thêm nếu cần
          body: JSON.stringify(chatMessage), // Chuyển tin nhắn thành chuỗi JSON
        });
        console.log("Tin nhắn đã được gửi:", chatMessage); // Log tin nhắn khi gửi thành công
        setInputMessage(""); // Xóa nội dung input sau khi gửi
        scrollToBottom(); // Cuộn xuống cuối container sau khi gửi

        // Cập nhật danh sách tin nhắn mới
        // setListChatHistory((prevMessages) => [...prevMessages, chatMessage]);
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error); // Log lỗi nếu xảy ra
      }
    }
  };

  //----------------------------- Cuộn để tải thêm tin nhắn --------------------------------------------
  const chatContainerRef = useRef(null); // Ref cho container chat
  const messagesEndRef = useRef(null); // Ref cho điểm cuối

  // Hàm cuộn đến cuối danh sách tin nhắn
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Cuộn xuống cuối lần đầu tiên khi render
  useEffect(() => {
    if (listChatHistory.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Trì hoãn nhỏ để đảm bảo DOM đã cập nhật
    }
  }, [listChatHistory]);

  useEffect(() => {
    if (nowMessages[currentRoomId]?.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Trì hoãn một chút để DOM có thể cập nhật
    }
  }, [nowMessages]);

  //----------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="loading-container">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="chat-container w-full flex flex-col bg-white h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="header flex items-center justify-between px-4 py-2 border-b">
          {/* Thông tin người dùng */}
          <div className="user-info flex items-center">
            <div className="mr-3">
              <img
                src={friend?.info?.avatar || ""}
                alt={friend?.username}
                height={30}
                width={30}
                className="rounded-full size-[50px] object-cover"
              />
            </div>
            <div>
              <div className="flex  justify-start items-center gap-4">
                <h3 className="text-lg font-semibold">{friend?.username}</h3>
                {/* <p className="text-gray-500 text-[10px]">
                    {friend.info.user.login ? "Online" : "Offline"}
                  </p> */}
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    friend.info.user.login ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </div>
            </div>
          </div>

          {/* Các nút */}
          <div className="actions flex gap-4 text-blue-500">
            <button>📞</button>
            <button>🎥</button>
            <button>ℹ️</button>
          </div>
        </div>

        {/* Khu vực tin nhắn */}
        <div
          className="messages flex-1 overflow-y-scroll p-4"
          ref={chatContainerRef}
          onScroll={() => {
            const container = chatContainerRef.current;
            if (container.scrollTop === 0 && hasMore) {
              loadHistory(currentPage); // Tải thêm tin nhắn khi cuộn lên
            }
          }}
        >
          {listChatHistory.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.senderId === currentUserId ? "flex-end" : "flex-start",
                margin: "10px 0",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    msg.senderId === currentUserId ? "#ff69b4" : "#f1f1f1", // Màu hồng
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    color:
                      msg.senderId === currentUserId ? "#ffffff" : "#000000", // Màu chữ
                  }}
                >
                  {msg.content}
                </p>
                <span
                  className="message-time"
                  style={{ fontSize: "0.8em", color: "#666666" }}
                >
                  {msg.createdAt}
                </span>
              </div>
            </div>
          ))}

          {(nowMessages[currentRoomId] || []).map((msg, index) => (
            <div
              key={`new-${index}`} // Tạo key duy nhất
              style={{
                display: "flex",
                justifyContent:
                  msg.senderId === currentUserId ? "flex-end" : "flex-start",
                margin: "10px 0",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    msg.senderId === currentUserId ? "#ff69b4" : "#f1f1f1", // Màu hồng
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    color:
                      msg.senderId === currentUserId ? "#ffffff" : "#000000", // Màu chữ
                  }}
                >
                  {msg.content}
                </p>
                <span
                  className="message-time"
                  style={{ fontSize: "0.8em", color: "#666666" }}
                >
                  {msg.createdAt}
                </span>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Hiển thị tin nhắn mình nhận được khi lắng nghe từ subcribe */}

        {/* {(
            nowMessages[createConversationId(currentUserId, otherUserId)] || []
          ).map((msg, index) => {
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.senderId === currentUserId ? "flex-end" : "flex-start",
                margin: "10px 0",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    msg.senderId === currentUserId ? "#e1ffc7" : "#f1f1f1",
                  textAlign: "left",
                }}
              >
                <p>{msg.content}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>;
          })} */}

        {/* Thanh nhập tin nhắn */}
        <div className="message-input flex items-center px-4 py-2 border-t">
          {/* Biểu tượng */}
          <div className="icons flex items-center gap-4 text-blue-500">
            <button>➕</button>
            <button>🖼️</button>
            <button>GIF</button>
          </div>
          {/* Input nhập tin nhắn */}
          <input
            type="text"
            value={inputMessage} // Giá trị của input
            onChange={(e) => setInputMessage(e.target.value)} // Cập nhật state khi nhập liệu
            placeholder="Nhập tin nhắn..."
            className="flex-1 border rounded-lg px-4 py-2 mx-4"
          />

          {/* Nút gửi */}

          <div className="flex items-center gap-4 text-blue-500">
            <button
              onClick={sendMessage} // Gọi hàm gửi tin nhắn khi click
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Gửi
            </button>
            <button>👍</button>
            <button>😊</button>
          </div>
        </div>
      </div>
    </>
  );
}
