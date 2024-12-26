import { Button, message, Modal, Spin } from "antd";
import { useParams } from "react-router-dom"; // Thêm useParams để lấy tham số động
import React, { useCallback, useEffect, useState } from "react";
import myImage from "../../../assets/avartaMeo.jpg";
import { FaHouse } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import ProfileHeader from "./ProfileHeader";
import CreatePostBox from "../../../components/user/createPostBox/CreatePostBox";
import RenderPostInProfile from "../../../components/user/renderPostInProflie/RenderPostInProfile";
import baseUrl, { getCurrentUserId } from "../../../apis/instance";

export default function Profile() {
  const { userId } = useParams(); // Lấy userId từ URL
  const currentUserId = localStorage.getItem("userId");
  const [userData, setUserData] = useState(null); // State để lưu thông tin cá nhân
  const [refresh, setRefresh] = useState(false); // State để theo dõi thay đổi
  const [loading, setLoading] = useState(true); // Trạng thái loading

  const [posts, setPosts] = useState([]); // State lưu danh sách bài viết được fetch từ API
  const [page, setPage] = useState(0); // Trang hiện tại
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải dữ liệu
  const [hasMore, setHasMore] = useState(true); // Có còn dữ liệu để tải không
  // ------------------------HẢI YẾN ----------POST---------------

  const [UserInfo, setUserInfo] = useState(); // UserInfo ở trong database
  // Lấy ID người dùng hiện tại từ localStorage

  useEffect(() => {
    if (currentUserId) {
      fetchUserInfo();
    }
  }, [currentUserId]);
  const fetchUserInfo = async () => {
    try {
      const userInfoRespone = await baseUrl.get(`userInfo/${userId}`);
      console.log("Dữ liệu API trả về:", userInfoRespone.data);
      setUserInfo(userInfoRespone.data);
      console.log("Dữ liệu API trả về: 2", UserInfo);
    } catch (error) {
      console.error("Lỗi khi gọi API fetchUserInfo:", error);
    }
  };
  useEffect(() => {
    if (UserInfo) {
      console.log("UserInfo đã được cập nhật:", UserInfo);
    }
  }, [UserInfo]);

  /**
   * Gọi API lấy thông tin người dùng
   */
  const fetchUserData = async () => {
    try {
      const response = await baseUrl.get(`/user/posts/profile/${userId}`);
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
    if (!userId) return; // Nếu không có userId, không gọi API

    // Tải thông tin người dùng
    fetchUserData();

    // Reset dữ liệu bài viết khi userId thay đổi
    fetchUserData().then(() => {
      setPosts([]);
      setPage(0);
      setHasMore(true);
      fetchPosts(0, 5, true);
    }); // Gọi API lấy bài viết lần đầu
  }, [userId, refresh]);

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
  //----------------------------HẢI YẾN ------trạng thái bạn bè---------------------------
  const [friendStatus, setFriendStatus] = useState(null); // Lưu trạng thái bạn bè
  const isOwnProfile = currentUserId && userId && userId === currentUserId;

  // Gọi API lấy trạng thái bạn bè
  useEffect(() => {
    const fetchFriendStatus = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`user/friends/status/${userId}`);
        console.log(response.data);
        setFriendStatus(response.data); // API trả về status
      } catch (error) {
        console.error("Failed to fetch friend status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId && userId) {
      fetchFriendStatus();
    }
  }, [currentUserId, userId]);

  const handleUpdateFriendStatus = (newStatus) => {
    setFriendStatus(newStatus); // Cập nhật trạng thái bạn bè
  };
  if (loading || !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <>
      {/* Khi trạng thái là "5" (Đã chặn) */}
      {friendStatus && friendStatus === 5 ? (
        <div>Trang người dùng không tồn tại-đã chặn hoặc bị chặn</div>
      ) : (
        <>
          <ProfileHeader
            UserInfo={UserInfo}
            friendStatus={friendStatus}
            userData={userData}
            isOwnProfile={isOwnProfile} // nếu đúng là người dùng
            userId={userId} // id của trang cá nhân người đang xem
            currentUserId={currentUserId} // id của người đang đăng nhập
            updateFriendStatus={handleUpdateFriendStatus}
          ></ProfileHeader>
          {/* Truyền thông tin cá nhân vào trang header */}
          <div className=" h-full w-full">
            {/* After bio content */}
            <div className="mx-auto my-3 h-full max-w-6xl">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 flex flex-col gap-4">
                  {/* intro phần thông tin ============================================== */}
                  <div className="flex flex-col gap-4 rounded-lg bg-white p-3 text-gray-600 shadow dark:bg-neutral-800 dark:text-gray-300">
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-300">
                      Intro
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-col items-center">
                        <p className="text-sm">Silence among noise</p>
                        <a
                          href="https://saiful-islam.vercel.app"
                          target="__blank"
                          rel="noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          https://saiful-islam.vercel.app
                        </a>
                      </div>
                      <button className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:hover:bg-neutral-600">
                        Edit bio
                      </button>
                    </div>
                    <div className="flex flex-col space-y-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fas fa-briefcase text-[1.25rem] text-gray-400"></i>
                        </span>
                        <p>Software Engineer</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fas fa-graduation-cap text-[1.25rem] text-gray-400"></i>
                        </span>
                        <p>
                          Studied B.Sc in SWE at{" "}
                          <span className="font-semibold">
                            Daffodil International University
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fas fa-home text-[1.25rem] text-gray-400"></i>
                        </span>
                        <p>
                          Lives in <span className="font-semibold">Dhaka</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fas fa-map-marker-alt text-[1.25rem] text-gray-400"></i>
                        </span>
                        <p>
                          From{" "}
                          <span className="font-semibold">
                            Chandpur, Chittagong, Bangladesh
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fas fa-heart text-[1.25rem] text-gray-400"></i>
                        </span>
                        <p>
                          <span className="font-semibold">Single</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fab fa-facebook text-[1.25rem] text-gray-400"></i>
                        </span>
                        <a
                          className="cursor-pointer hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={"https://facebook.com/saifulshihab"}
                        >
                          <p>saifulshihab</p>
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fab fa-instagram text-[1.25rem] text-gray-400"></i>
                        </span>
                        <a
                          className="cursor-pointer hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={"https://instagram.com/_shiha6"}
                        >
                          <p>_shiha6</p>
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fab fa-twitter text-[1.25rem] text-gray-400"></i>
                        </span>
                        <a
                          className="cursor-pointer hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={"https://twitter.com/ShihabSWE"}
                        >
                          <p>ShihabSWE</p>
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fab fa-github text-[1.25rem] text-gray-400"></i>
                        </span>
                        <a
                          className="cursor-pointer hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={"https://github.com/saifulshihab"}
                        >
                          <p>saifulshihab</p>
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <i className="fab fa-behance text-[1.25rem] text-gray-400"></i>
                        </span>
                        <a
                          className="cursor-pointer hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={"https://www.behance.net/saifulis1am"}
                        >
                          <p>saifulis1am</p>
                        </a>
                      </div>
                    </div>

                    <div>
                      <button className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:hover:bg-neutral-600">
                        Edit details
                      </button>
                    </div>
                    {/* Story & Reel================ */}
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <img
                        className="cursor-pointer rounded-lg w-[6rem] sm:w-[8rem] md:w-[10rem] lg:w-[12rem]"
                        alt="featured"
                        src="https://random.imagecdn.app/120/215"
                      />
                      <img
                        className="cursor-pointer rounded-lg w-[6rem] sm:w-[8rem] md:w-[10rem] lg:w-[12rem]"
                        alt="featured"
                        src="https://random.imagecdn.app/120/215"
                      />
                      <img
                        className="cursor-pointer rounded-lg w-[6rem] sm:w-[8rem] md:w-[10rem] lg:w-[12rem]"
                        alt="featured"
                        src="https://random.imagecdn.app/120/215"
                      />
                    </div>

                    <div>
                      <button className="w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:hover:bg-neutral-600">
                        Edit featured
                      </button>
                    </div>
                  </div>
                  {/* PHOTO ảnh ==========================================================  */}
                  <div className="flex flex-col gap-4 rounded-lg bg-white p-3 text-gray-600 shadow dark:bg-neutral-800">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-300">
                        Photos
                      </p>
                      <a className="cursor-pointer text-sm text-primary hover:underline">
                        See all photos
                      </a>
                    </div>
                    <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-md">
                      <img
                        className="w-full"
                        alt="photo"
                        src="https://random.imagecdn.app/125/125"
                      />
                      <img
                        className="w-full"
                        alt="photo"
                        src="https://random.imagecdn.app/125/124"
                      />
                      <img
                        className="w-full"
                        alt="photo"
                        src="https://random.imagecdn.app/125/123"
                      />
                    </div>
                  </div>
                  {/* FRIENd bạn bè */}
                  <div className="flex flex-col gap-4 rounded-lg bg-white p-3 shadow dark:bg-neutral-800">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-800 dark:text-gray-300">
                          Friends
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          528 friends
                        </p>
                      </div>
                      <a className="cursor-pointer text-sm text-primary hover:underline">
                        See all friends
                      </a>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <img
                          className="w-full rounded-md"
                          alt="photo"
                          src="https://random.imagecdn.app/125/125"
                        />
                        <p className="mt-2 text-sm text-black dark:text-gray-200">
                          Friend 1
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  {/* Create post khung đăng post */}

                  {isOwnProfile && (
                    <CreatePostBox
                      onPostCreated={triggerRefresh}
                      userData={userData} // Truyền thông tin người dùng khi đã sẵn sàng
                    />
                  )}
                  {/* post filter box */}
                  <div className="mt-4 rounded-md bg-white p-2 px-3 text-sm shadow dark:bg-neutral-800 mb-4">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-neutral-700">
                      <div>
                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
                          Posts
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600">
                          <i className="fas fa-sliders-h mr-2"></i>Filters
                        </button>
                        <button className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600">
                          <i className="fas fa-cog mr-2"></i>Manage Posts
                        </button>
                      </div>
                    </div>
                    <div className="-mb-1 mt-1 flex space-x-3">
                      <button
                        className={`h-8 flex-1 justify-center space-x-2 rounded-md font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-neutral-700 ${
                          posts === "listView"
                            ? "bg-gray-200 dark:bg-neutral-700"
                            : undefined
                        }`}
                        onClick={() => setPosts("listView")}
                      >
                        <i className="fas fa-bars mr-2"></i>List View
                      </button>
                      <button
                        className={`h-8 flex-1 justify-center space-x-2 rounded-md font-semibold text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-neutral-700 ${
                          posts === "gridView"
                            ? "bg-gray-200 dark:bg-neutral-700"
                            : undefined
                        }`}
                        onClick={() => setPosts("gridView")}
                      >
                        <i className="fas fa-th-large mr-2"></i>Grid View
                      </button>
                    </div>
                  </div>
                  {/* user posts những bài đăng của user */}
                  {/* <PostContainer postsView={postsView} /> */}
                  <RenderPostInProfile
                    onFetchData={fetchPosts}
                    posts={posts}
                    currentUserId={currentUserId}
                  ></RenderPostInProfile>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
