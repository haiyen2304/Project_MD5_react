import React, { useCallback, useEffect, useState } from "react";
import {
  FaPlusCircle,
  FaComment,
  FaShare,
  FaHeart,
  FaGrin,
  FaSadTear,
  FaCamera,
  FaSmile,
} from "react-icons/fa";
import { FaFaceAngry } from "react-icons/fa6";
import { AiOutlineLike } from "react-icons/ai";
import { message } from "antd";
import CreatePostBox from "../../../components/user/createPostBox/CreatePostBox";
import baseUrl from "../../../apis/instance";
import { Link, useParams } from "react-router-dom";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Modal } from "antd"; // Sử dụng Modal từ Ant Design hoặc thư viện khác
import RenderPostInProfile from "../../../components/user/renderPostInProflie/RenderPostInProfile";

// ---------------HÙng -------------
const Story = ({ story, openModal }) => {
  return (
    <div
      className="to relative h-48 w-28 cursor-pointer rounded-xl p-3 shadow"
      style={{
        backgroundImage: story.mediaUrl ? `url(${story.mediaUrl})` : "",
        backgroundSize: "cover", // Đảm bảo hình ảnh phủ kín khung
        backgroundPosition: "center", // Căn giữa hình ảnh
      }}
    >
      <div className="absolute rounded-full border-4 border-white dark:border-neutral-800">
        <img
          src={story.mediaUrl || "/default-avatar.png"} // Dự phòng nếu `mediaUrl` không tồn tại
          className="h-8 w-8 rounded-full border-4"
          alt="story"
        />
      </div>
      <div className="absolute text-center" style={{ bottom: "5%" }}>
        <p className="font-semibold text-black">
          {story.mediaUrl ? story.content : story.content}
        </p>
      </div>
    </div>
  );
};

const NewsFeedPage = () => {
  //-------------------------HÙNG-----------------------------
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseUrl.get("user/stories");
        setStories(response.data);
      } catch (error) {
        message.error("lấy dữ liệu bị lỗi");
      }
    };
    fetchData();
  }, []);

  // Tính toán danh sách story hiện tại
  const visibleStories = stories.slice(currentIndex, currentIndex + 5);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex + 5 < stories.length) setCurrentIndex(currentIndex + 1);
  };

  const openModal = (story) => {
    setSelectedStory(story);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedStory(null);
  };

  const sendReactionToStory = async (storyId, iconId) => {
    const reactionData = {
      storyId: storyId,
      iconId: iconId, // iconId từ 1 đến 5
    };

    try {
      const response = await baseUrl.post("user/storyReaction", reactionData);
      if (response.status === 201) {
        message.success("Bày tỏ cảm xúc thành công!");
      } else {
        message.error("Bày tỏ cảm xúc thất bại!");
      }
    } catch (error) {
      message.error("Lỗi khi gửi phản hồi!");
    }
  };

  // ------------------------HẢI YẾN ----------POST---------------

  const { userId } = useParams(); // Lấy userId từ URL
  const currentUserId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null); // State để lưu thông tin cá nhân
  const [refresh, setRefresh] = useState(false); // State để theo dõi thay đổi

  const [posts, setPosts] = useState([]); // State lưu danh sách bài viết được fetch từ API
  const [page, setPage] = useState(0); // Trang hiện tại
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải dữ liệu
  const [hasMore, setHasMore] = useState(true); // Có còn dữ liệu để tải không

  /**
   * Gọi API lấy thông tin người dùng
   */
  const fetchUserData = async () => {
    try {
      const response = await baseUrl.get(
        `/user/posts/profile/${currentUserId}`
      );
      setUserData(response.data); // Lưu thông tin người dùng
    } catch (error) {
      message.error("Lỗi khi lấy thông tin người dùng.");
    }
  };
  console.log("trang hiện tại là trang số: ", page);

  /**
   * Gọi API lấy bài viết
   */
  const fetchPosts = async (page = 0, size = 5, reset = false) => {
    try {
      if (!hasMore || isLoading) return; // Tránh gọi API nếu đang tải hoặc hết bài viết
      setIsLoading(true);

      const response = await baseUrl.get("/user/posts/all", {
        params: {
          userParamId: userId,
          page,
          size,
        },
      });

      const newPosts = response.data.content;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]); // Gộp bài viết mới vào bài viết cũ
      setHasMore(!response.data.last); // Đánh dấu nếu đã tải hết dữ liệu
      setPage((prevPage) => prevPage + 1); // Tăng số trang hiện tại
    } catch (error) {
      message.error("Lỗi khi tải bài viết.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gọi API khi userId thay đổi (thông tin người dùng và bài viết độc lập)
   */
  useEffect(() => {
    if (!currentUserId) return; // Nếu không có userId, không gọi API

    // Tải thông tin người dùng
    fetchUserData();

    // Reset dữ liệu bài viết khi userId thay đổi
    fetchUserData().then(() => {
      setPosts([]);
      setPage(0);
      setHasMore(true);
      fetchPosts(0, 5, true);
    }); // Gọi API lấy bài viết lần đầu
  }, [currentUserId, refresh, userId]);

  /**
   * Xử lý cuộn trang
   */
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      fetchPosts(page, 5);
    }
  }, [page, hasMore, isLoading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const triggerRefresh = () => {
    setRefresh((prev) => !prev); // Thay đổi trạng thái để kích hoạt useEffect
  };
  return (
    <div className="m-auto w-[42.5rem]">
      <div className="mt-6 h-full w-full pb-5">
        {/* Story Section */}
        <div className="relative my-6 flex w-full items-center justify-center space-x-2 overflow-hidden">
          {/* Nút Previous */}
          {currentIndex > 0 && (
            <button
              className="absolute left-0 z-50 bg-white p-2 rounded-full shadow dark:bg-neutral-800"
              onClick={handlePrev}
            >
              <FaChevronLeft className="text-gray-700 dark:text-white" />
            </button>
          )}

          <Link to={"/createStory"}>
            <div
              className="relative h-48 w-28 rounded-xl shadow"
              style={{
                backgroundImage: `url('https://random.imagecdn.app/500/400')`,
              }}
            >
              <div
                className="absolute flex w-full justify-center"
                style={{ bottom: "11%" }}
              >
                <button className="z-40">
                  <FaPlusCircle className=" text-blue-600 bg-white z-40 h-10 w-10 rounded-full border-4 border-white bg-primary focus:outline-none dark:border-neutral-800" />
                </button>
              </div>

              <div className="absolute bottom-0 z-30 h-auto w-full rounded-b-lg bg-white p-2 pt-4 text-center dark:bg-neutral-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-200">
                  Create Story
                </p>
              </div>
            </div>
          </Link>

          {/* Hiển thị stories */}
          {visibleStories.map((story, idx) => (
            <div key={idx} onClick={() => openModal(story)}>
              <Story story={story} />
            </div>
          ))}
          {/* Nút Next */}
          {currentIndex + 5 < stories.length && (
            <button
              className="absolute right-0 z-50 bg-white p-2 rounded-full shadow dark:bg-neutral-800"
              onClick={handleNext}
            >
              <FaChevronRight className="text-gray-700 dark:text-white" />
            </button>
          )}
        </div>
        {/* Create Post */}
        <CreatePostBox
          onPostCreated={triggerRefresh}
          userData={userData} // Truyền thông tin người dùng khi đã sẵn sàng
        />
        {/* ----------------------- HẢI YẾN ----------------------- */}
        {/* All posts */}
        <div className="mt-4 h-full w-full">
          <div className="grid gap-2 grid-cols-1">
            <RenderPostInProfile
              onFetchData={fetchPosts}
              posts={posts}
              currentUserId={currentUserId}
            ></RenderPostInProfile>
            {/*-----------------------  HẢI YẾN  -----------------------*/}
          </div>
        </div>
      </div>
      {/* Modal hiển thị story */}
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="!w-[350px] !h-[450px]"
        closable={false}
      >
        {console.log("selectedStory", selectedStory)}
        {selectedStory && (
          <div>
            {selectedStory.mediaUrl ? (
              <div>
                <img
                  src={selectedStory.mediaUrl}
                  alt=""
                  style={{
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "10px",
                  }}
                />
              </div>
            ) : (
              <div className="w-[300px] h-[450px] bg-blue-500  flex items-center rounded-md">
                <p className="mt-4 text-white text-[20px] px-5 w-[200px]">
                  {selectedStory.content}
                </p>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between  pt-2">
          <div className="">
            <input
              type="text"
              placeholder="trả lời.."
              className="rounded-md focus:border-gray-400 w-full"
            />
          </div>
          <div className="w-2/3 flex justify-end gap-2">
            <AiOutlineLike
              className="text-blue-500 text-xl cursor-pointer"
              onClick={() => sendReactionToStory(selectedStory.id, 1)}
            />
            <FaHeart
              className="text-red-400 text-xl cursor-pointer"
              onClick={() => sendReactionToStory(selectedStory.id, 2)}
            />
            <FaSmile
              className="text-yellow-500 text-xl cursor-pointer"
              onClick={() => sendReactionToStory(selectedStory.id, 3)}
            />
            <FaSadTear
              className="text-blue-500 text-xl cursor-pointer"
              onClick={() => sendReactionToStory(selectedStory.id, 4)}
            />
            <FaFaceAngry
              className="text-orange-500 text-xl cursor-pointer"
              onClick={() => sendReactionToStory(selectedStory.id, 5)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewsFeedPage;
