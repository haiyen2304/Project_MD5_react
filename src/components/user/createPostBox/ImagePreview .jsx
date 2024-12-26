import React from "react";
import { UploadOutlined } from "@ant-design/icons";
// test của antd UploadFife - không dùng, để lại đề phòng
export default function ImagePreview({ file }) {
  const isImage = file.type.startsWith("image/");
  return (
    <>
      <div className="flex flex-col items-center">
        {/* Nếu file là ảnh, hiển thị ảnh */}
        {isImage ? (
          <img
            src={URL.createObjectURL(file.originFileObj)}
            alt={file.name}
            className="h-20 w-20 object-cover rounded-lg border shadow"
          />
        ) : (
          // Nếu không phải ảnh, hiển thị biểu tượng và tên file
          <div className="text-gray-600 flex flex-col items-center">
            <UploadOutlined />
            <p className="mt-2 text-sm">{file.name}</p>
          </div>
        )}
      </div>
    </>
  );
}
