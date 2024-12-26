import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoCloseSharp } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import myImage from "../../../assets/avartaMeo.jpg";
import baseUrl from "../../../apis/instance"; // import base URL for axios

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [privacy, setPrivacy] = useState("public"); // state to manage privacy setting
  const [message, setMessage] = useState(""); // to display status message

  const handleInputChange = (e) => {
    setGroupName(e.target.value);
  };

  const handlePrivacyChange = (e) => {
    setPrivacy(e.target.value); // Update privacy when user selects a new option
  };

  const createGroup = async () => {
    try {
      const response = await baseUrl.post("user/groups", {
        title: groupName,
        type: privacy.toUpperCase(),
      });

      if (response.status === 201) {
        setMessage("Tạo nhóm thành công.");
      } else if (response.status === 204) {
        setMessage("Tạo nhóm thất bại.");
      } else {
        setMessage("Lỗi không xác định.");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setMessage("Lỗi kết nối.");
    }
  };

  return (
    <div className="h-screen flex font-semibold">
      <div className="w-1/4 h-full bg-white relative">
        <div className="mt-5">
          <div className="flex justify-start items-center gap-3 border-b-2 pb-3 pl-3">
            <Link to="/">
              <div className="w-10 h-10 bg-gray-300 flex items-center justify-center rounded-full">
                <IoCloseSharp className="text-lg" />
              </div>
            </Link>
            <Link to="/">
              <div>
                <FaFacebook className="text-[40px] text-blue-500" />
              </div>
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 mx-3">
          <h2 className="text-[24px] text-black">Tạo nhóm</h2>
          <div className="w-10 h-10 bg-gray-300 flex items-center justify-center rounded-full">
            <IoMdSettings className="text-[24px]" />
          </div>
        </div>

        <div className="flex flex-col pb-5 border-b-2">
          <ul>
            <li className="flex items-center mt-5 gap-4 p-4 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                height={60}
                width={60}
                src={myImage}
                alt="Avatar"
                className="rounded-full"
              />
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-sm">Nguyễn Văn Mều</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Form input to create a new group */}
        <div className="flex flex-col mt-5 p-4 border-b-2">
          <input
            type="text"
            placeholder="Tên nhóm"
            value={groupName}
            onChange={handleInputChange}
            className="p-2 border rounded-md w-full mb-3"
          />

          {/* Select for privacy setting */}
          <select
            value={privacy}
            onChange={handlePrivacyChange}
            className="p-2 border rounded-md mb-3"
          >
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
          </select>

          <button
            className="bg-blue-500 text-white py-2 rounded-md"
            onClick={createGroup}
          >
            Tạo nhóm
          </button>

          {/* Displaying the message */}
          {message && <p className="mt-3 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
}
