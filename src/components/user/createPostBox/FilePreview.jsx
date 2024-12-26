import React from "react";
import { UploadOutlined } from "@ant-design/icons";

export default function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith("image/");
  return (
    <>
      <div key={file.uid} className="relative">
        {/* Hiển thị ảnh nếu là ảnh */}
        {isImage ? (
          <img
            src={URL.createObjectURL(file.originFileObj)}
            alt={file.name}
            className="h-20 w-20 object-cover rounded-lg border shadow"
          />
        ) : (
          // Hiển thị biểu tượng và tên nếu không phải ảnh
          <div className="text-gray-600 flex flex-col items-center">
            <UploadOutlined />
            <p className="mt-2 text-sm">{file.name}</p>
          </div>
        )}

        {/* Nút xóa */}
        <button
          className="absolute  top-0 right-0 bg-red-500 text-white rounded-full p-1 h-5 flex items-center justify-center hover:bg-red-300   transition-all"
          onClick={() => onRemove(file)} // Gọi hàm xóa khi click
        >
          X
        </button>
      </div>
    </>
  );
}
