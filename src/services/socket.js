// import { io } from "socket.io-client";

// // Địa chỉ server backend
// const SOCKET_URL = "http://localhost:8080";

// // Khởi tạo socket client
// export const socket = io(SOCKET_URL, {
//   autoConnect: false, // Không tự động kết nối
//   transports: ["websocket"], // Sử dụng WebSocket
// });


import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// URL WebSocket backend
const SOCKET_URL = "http://localhost:8080/chat-websocket";

// Tạo STOMP client
export const stompClient = new Client({
  webSocketFactory: () => new SockJS(SOCKET_URL), // Kết nối SockJS
  reconnectDelay: 5000, // Thử kết nối lại sau 5 giây nếu kết nối thất bại
  heartbeatIncoming: 4000, // Kiểm tra kết nối từ server (millisecond)
  heartbeatOutgoing: 4000, // Kiểm tra kết nối từ client (millisecond)
  onConnect: () => {
    console.log("Connected to WebSocket server");
  },
  onStompError: (error) => {
    console.error("WebSocket error:", error);
  },
});