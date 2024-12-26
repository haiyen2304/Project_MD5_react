import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import myImage from "../../../assets/avartaMeo.jpg";
import { IoCloseSharp, IoText } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaImages } from "react-icons/fa6";
import { message } from "antd";
import baseUrl, { formUrl } from "../../../apis/instance";
import { useRef } from "react";

export default function CreateStory() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageSize, setImageSize] = useState(300); // Kích thước ảnh mặc định là 300px
  const [mediaType, setMediaType] = useState(""); // Loại media
  const [showButtons, setShowButtons] = useState(false);
  const [textContent, setTextContent] = useState("");
  const fileInputRef = useRef(null);

  const handleTextArea = (event) => {
    setTextContent(event.target.value);
  };

  const handleCancelInput = () => {
    setPreview(null);
    setShowButtons(false);
    setMediaType("");
    setTextContent("");
  };

  const handleLabelClick = (type) => {
    console.log(type);
    setMediaType(type); // Cập nhật loại media
    setShowButtons(true);
  };

  const handleResize = (e) => {
    setImageSize(e.target.value); // Cập nhật kích thước ảnh khi thanh trượt thay đổi
  };

  const handleChange = (e) => {
    const file = e.target.files[0]; // Lấy file từ input

    if (!file) {
      // Người dùng nhấn "Cancel" trong hộp thoại
      setShowButtons(false); // Ẩn các nút
      setPreview(null); // Đảm bảo không hiển thị preview cũ
      return;
    }

    const reader = new FileReader();
    setMediaType("image"); // Đặt loại media là "image"

    reader.onloadend = () => {
      setPreview(reader.result); // Lưu chuỗi Base64 vào preview
    };

    reader.readAsDataURL(file); // Chuyển file sang Base64
    setFile(file); // Lưu file vào state nếu cần upload sau này
    setShowButtons(true); // Hiển thị các nút khi có file được chọn
  };

  const handleAddStory = async () => {
    const formData = new FormData();

    formData.append("mediaType", mediaType);
    formData.append("content", textContent || ""); // Đảm bảo content không bị null
    if (file) {
      formData.append("mediaUrl", file);
    }

    try {
      const response = await formUrl.post("user/stories", formData);
      message.success("Bài viết đã được đăng thành công!");
      // Đặt lại các state để xóa dữ liệu trên form
      setMediaType("");
      setImageUrl("");
      setTextContent("");
      setFile(null);
      setPreview(null);
      setShowButtons(false);
    } catch (error) {
      message.error("Đăng bài viết không thành công!");
    }
  };

  return (
    <>
      <div className="h-screen  flex font-semibold">
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
            <h2 className="text-[24px] text-black">Tin của bạn</h2>
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

          {mediaType === "text" && (
            <div className="text-center mt-5">
              <textarea
                value={textContent}
                onChange={handleTextArea}
                name=""
                id=""
                placeholder="Bắt đầu nhập!"
                className="w-5/6 resize-none border-2 rounded-md"
                rows="6"
              ></textarea>
            </div>
          )}

          {showButtons && (
            <div className="absolute bottom-[12%] flex gap-3 w-full px-5 border-t-2 pt-3">
              <button
                className="h-[36px] w-1/3 bg-gray-300 rounded-md"
                onClick={handleCancelInput} // Đóng khi nhấn "Bỏ"
              >
                Bỏ
              </button>
              <button
                onClick={handleAddStory}
                className="h-[36px] w-2/3 bg-blue-500 text-white rounded-md"
              >
                Chia sẻ lên tin
              </button>
            </div>
          )}
        </div>

        <div
          className={`w-3/4 flex justify-center items-center gap-5 ${
            mediaType !== "" ? "flex-col" : "flex-row"
          }`}
        >
          {preview ? (
            <>
              <div className="bg-white w-[300px] h-[385px] flex flex-col justify-center items-center rounded-md shadow-md">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: `${imageSize}px`, height: `${imageSize}px` }} // Sử dụng imageSize từ state để thay đổi kích thước
                  className="object-cover rounded-md"
                />
              </div>

              <div className="w-full mt-4 flex justify-center">
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={imageSize}
                  onChange={handleResize}
                  className="w-[80%] max-w-[400px]"
                />
                <span className="ml-2">{imageSize}px</span>{" "}
                {/* Hiển thị giá trị kích thước */}
              </div>
            </>
          ) : mediaType !== "text" ? (
            <>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                ref={fileInputRef}
                onChange={handleChange}
              />
              <label
                htmlFor="fileInput"
                className="bg-white w-[220px] h-[330px] flex flex-col justify-center items-center rounded-md shadow-md hover:bg-gray-200 cursor-pointer transition duration-300"
                onClick={() => handleLabelClick("image")}
              >
                <FaImages className="text-blue-500 text-[30px]" />
                <p className="text-gray-800 text-[16px] mt-2 font-semibold">
                  Tải lên hình ảnh
                </p>
              </label>

              <label
                className="bg-white w-[220px] h-[330px] flex flex-col justify-center items-center rounded-md shadow-md hover:bg-gray-200 transition duration-300"
                onClick={() => handleLabelClick("text")} // Truyền "text" khi tạo tin dạng văn bản
              >
                <IoText className="text-blue-500 text-[30px]" />
                <p className="text-gray-800 text-[16px] font-semibold">
                  Tạo tin dạng văn bản
                </p>
              </label>
            </>
          ) : (
            <div className="bg-blue-400 w-[280px] h-[400px] text-center flex items-center">
              <p className="text-[20px] text-white px-3 break-words w-[280px]">
                {textContent}
              </p>
            </div>
          )}
        </div>

        {/* Thanh trượt điều chỉnh kích thước ảnh */}
      </div>
    </>
  );
}
