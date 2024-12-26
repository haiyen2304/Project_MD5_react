import React, { useRef, useState } from "react";
import myImage from "../../../assets/avartaMeo.jpg";
import { FaHouse } from "react-icons/fa6";
import { FaEllipsisH, FaMapMarkerAlt } from "react-icons/fa";
import { message } from "antd";

export default function UserEditModal({ currentUserId, UserInfo }) {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [wallImageFile, setWallImageFile] = useState(null); // State cho ảnh tường
  const [wallPreview, setWallPreview] = useState(null); // State lưu preview của ảnh tường
  const wallInputRef = useRef(null); // Ref cho input ảnh tường

  const handleAddImage = async () => {
    const formData = new FormData();
    // Kiểm tra xem đã có ảnh đại diện và ảnh bìa hay chưa
    if (file) {
      formData.append("avatar", file);
    }

    if (wallImageFile) {
      formData.append("wallpaper", wallImageFile);
    }
    formData.append("id", currentUserId);

    console.log("avarta", file);
    console.log("wallpaper", wallImageFile);
    console.log("id", currentUserId);

    try {
      // Gửi FormData lên server
      const response = await formUrl.post("userInfo/edit", formData);
      message.success("Chỉnh sửa ảnh thành công!");
      // Reset lại các state
      setFile(null);
      setPreview(null);
      setWallImageFile(null);
      setWallPreview(null);
    } catch (error) {
      message.error("Chỉnh sửa ảnh thất bại!");
    }
  };

  const handleChange = (e, type) => {
    const file = e.target.files[0]; // Lấy file từ input

    if (!file) {
      // Người dùng nhấn "Cancel" trong hộp thoại
      if (type === "profileImage") {
        setPreview(null);
      } else if (type === "wallImage") {
        setWallPreview(null);
      }
      return;
    }

    // Kiểm tra loại file (chỉ cho phép ảnh)
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một tệp ảnh hợp lệ!");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (type === "profileImage") {
        setPreview(reader.result); // Lưu chuỗi Base64 vào preview
        setFile(file); // Lưu file vào state
      } else if (type === "wallImage") {
        setWallPreview(reader.result); // Lưu chuỗi Base64 vào preview
        setWallImageFile(file); // Lưu file vào state
      }
    };

    reader.readAsDataURL(file); // Chuyển file sang Base64
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <input
          id="profileImageInput"
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={(e) => handleChange(e, "profileImage")} // Truyền type chính xác
        />
        <div className="flex justify-between">
          <h1>Ảnh đại diện</h1>
          <label
            htmlFor="profileImageInput"
            className="border-none rounded-md hover:bg-gray-200 p-2 text-blue-400"
          >
            Chỉnh sửa
          </label>
        </div>
        <div className="flex justify-center">
          <img
            className="rounded-full object-cover"
            src={preview || UserInfo?.avatar} // Hiển thị ảnh mặc định nếu chưa chọn ảnh
            height={100} // Tùy chỉnh chiều cao
            width={100} // Tùy chỉnh chiều rộng
            style={{ aspectRatio: "1 / 1" }} // Đảm bảo ảnh giữ tỉ lệ 1:1
            alt="Preview"
          />
        </div>

        <div className="flex justify-between">
          <input
            id="wallImageInput"
            type="file"
            style={{ display: "none" }}
            ref={wallInputRef}
            onChange={(e) => handleChange(e, "wallImage")} // Truyền type chính xác
          />
          <h1>Ảnh Bìa </h1>
          <label
            htmlFor="wallImageInput"
            className="border-none rounded-md hover:bg-gray-200 p-2 text-blue-400"
          >
            Chỉnh sửa
          </label>
        </div>
        <div className="flex justify-center  ">
          <img
            className="rounded-md h-[185px] w-[500px]"
            src={wallPreview || UserInfo?.wallpaper}
            alt=""
          />
        </div>
        <div className="flex justify-between">
          <h1>Tiểu sử</h1>
          <button className="border-none rounded-md hover:bg-gray-200 p-2 text-blue-400">
            thêm
          </button>
        </div>
        <div className="flex justify-between">
          <h1>Chỉnh sửa phần giới thiệu</h1>
          <button className="border-none rounded-md hover:bg-gray-200 p-2 text-blue-400">
            Chỉnh sửa
          </button>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex justify-start items-center gap-3">
            <FaHouse className="text-[20px]" />
            <p>Sống tại Bắc Ninh</p>
          </div>
          <div className="flex justify-start items-center gap-3">
            <FaMapMarkerAlt className="text-[20px]" />
            <p>đến từ Bắc Ninh</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full mt-5">
        <button
          onClick={handleAddImage}
          className="w-full bg-blue-100 py-2 rounded-md hover:bg-gray-200"
        >
          Chỉnh sửa thông tin giới thiệu
        </button>
      </div>
    </>
  );
}
