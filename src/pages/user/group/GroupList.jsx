import React, { useEffect, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa";
import { RiCompassDiscoverFill } from "react-icons/ri";
import { MdGroups } from "react-icons/md";
import { Link } from "react-router-dom";
import myImage from "../../../assets/avartaMeo.jpg";
import baseUrl from "../../../apis/instance";
import { debounce } from "lodash";
import { Button, Spin } from "antd"; // Thêm Spin từ Ant Design

export default function GroupList() {
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [keyword, setKeyword] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const pageSize = 5; // Số item trên mỗi trang
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await baseUrl.get("user/groups/myGroups");
        setMyGroups(response.data);

        const joinedGroups = await baseUrl.get("user/groups/joinedGroups");
        setJoinedGroups(joinedGroups.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    if (keyword.trim()) {
      handleSearch(keyword);
    } else {
      setSearchResults([]);
    }

    fetchGroups();
  }, [keyword]);

  // Gọi API tìm kiếm khi từ khóa thay đổi, sử dụng debounce để giảm số lần gọi API
  const handleSearch = debounce((value) => {
    fetchSearchResults(value, 0);
  }, 2000);

  const fetchSearchResults = async (searchKeyword, page = 0) => {
    setIsLoading(true); // Bắt đầu tải
    try {
      const response = await baseUrl.get("user/groups/search", {
        params: {
          keyword: searchKeyword,
          page,
          size: pageSize,
        },
      });
      setSearchResults(response.data.content); // Dữ liệu của nhóm
      setTotalPages(response.data.totalPages); // Tổng số trang
      setCurrentPage(page); // Trang hiện tại
    } catch (error) {
      console.error("Lỗi khi tìm kiếm nhóm:", error);
    } finally {
      setIsLoading(false); // Kết thúc tải
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-[24px] text-black">Nhóm</h2>
        <div className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
          <IoMdSettings className="text-lg" />
        </div>
      </div>
      <div className="relative mt-4">
        {/* Search Input */}
        <input
          type="search"
          placeholder="検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full px-10  border border-gray-300 rounded-full py-1"
        />
        {/* Search Icon */}
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[18px]">Kết quả tìm kiếm</h3>
          <ul>
            {searchResults.map((group) => (
              <Link to={`/groupMain/${group.id}`}>
                <li className="flex gap-3 my-3 hover:bg-gray-200">
                  <img
                    src={myImage} // Sử dụng ảnh từ API hoặc ảnh mặc định
                    alt={group.title}
                    height={50}
                    width={50}
                    className="rounded-md"
                  />
                  <div className="flex flex-col">
                    <p>{group.title}</p>
                    <p className="text-[12px] text-gray-500">
                      lần hoạt động gần nhất {group.lastActive || "chưa rõ"}
                    </p>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Trang trước
            </button>
            <button
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 mt-3 overflow-auto rounded-md">
        <div className="flex gap-5 hover:bg-gray-200 p-2">
          <div className="h-8 w-8 flex items-center justify-center bg-gray-300 rounded-full text-[16px]">
            <FaNewspaper />
          </div>
          <p>bảng feed của bạn</p>
        </div>
        <div className="flex gap-5 hover:bg-gray-200 p-2 rounded-md">
          <div className="h-8 w-8 flex items-center justify-center bg-gray-300 rounded-full text-[16px]">
            <RiCompassDiscoverFill />
          </div>
          <p>khám phá</p>
        </div>
        <div className="flex gap-5 hover:bg-gray-200 p-2 rounded-md">
          <div className="h-8 w-8 flex items-center justify-center bg-gray-300 rounded-full text-[16px]">
            <MdGroups />
          </div>
          <p>nhóm</p>
        </div>
        <Link to={"/createGroup"} className="">
          <Button className="w-full border-none bg-blue-200 text-blue-600">
            + tạo nhóm mới
          </Button>
        </Link>
        <div className="flex justify-between border-t-2 pt-2 flex-col">
          <p className="text-[18px]">nhóm do bạn quản lý</p>
          {myGroups.length > 0 ? (
            myGroups.map((group) => (
              <ul key={group.id}>
                {" "}
                {/* Đảm bảo mỗi item có key duy nhất */}
                <Link to={`/groupMain/${group.id}`}>
                  <li className="flex gap-3 my-3 hover:bg-gray-200">
                    <img
                      src={myImage} // Sử dụng ảnh từ API hoặc ảnh mặc định
                      alt={group.title}
                      height={50}
                      width={50}
                      className="rounded-md"
                    />
                    <div className="flex flex-col">
                      <p>{group.title}</p>
                      <p className="text-[12px] text-gray-500">
                        lần hoạt động gần nhất {group.lastActive || "chưa rõ"}
                      </p>
                    </div>
                  </li>
                </Link>
              </ul>
            ))
          ) : (
            <p>Không có nhóm nào để hiển thị.</p>
          )}
        </div>
        <div className="flex justify-between border-t-2 pt-2 flex-col">
          <p className="text-[18px]">nhóm đã tham gia</p>
          {joinedGroups.length > 0 ? (
            joinedGroups.map((group) => (
              <ul key={group.id}>
                {" "}
                {/* Đảm bảo mỗi item có key duy nhất */}
                <Link to={`/groupMain/${group.id}`}>
                  <li className="flex gap-3 my-3 hover:bg-gray-200">
                    <img
                      src={myImage} // Sử dụng ảnh từ API hoặc ảnh mặc định
                      alt={group.title}
                      height={50}
                      width={50}
                      className="rounded-md"
                    />
                    <div className="flex flex-col">
                      <p>{group.title}</p>
                      <p className="text-[12px] text-gray-500">
                        lần hoạt động gần nhất {group.lastActive || "chưa rõ"}
                      </p>
                    </div>
                  </li>
                </Link>
              </ul>
            ))
          ) : (
            <p>Không có nhóm nào để hiển thị.</p>
          )}
        </div>
      </div>
    </>
  );
}
