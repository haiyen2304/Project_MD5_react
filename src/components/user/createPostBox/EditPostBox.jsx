import { Button, message, Modal, Select, Upload, Avatar } from "antd";
import React, { useState } from "react";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import FilePreview from "./FilePreview";
import TagFriends from "./TagFriends";
import baseUrl, { formUrl } from "../../../apis/instance";
// Import component hiển thị ảnh
const { Option } = Select;

export default function EditPostBox() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal tạo bài viết
  const [isTagModalOpen, setIsTagModalOpen] = useState(false); // Trạng thái modal gắn thẻ
  const [taggedFriends, setTaggedFriends] = useState([]); // Danh sách bạn bè được tag
  const [isLoading, setIsLoading] = useState(false);

  // Hàm mở modal tạo bài viết
  const openModal = () => setIsModalOpen(true);
  // Hàm đóng modal tạo bài viết
  const closeModal = () => setIsModalOpen(false);
  // Hàm mở modal gắn thẻ
  const openTagModal = () => setIsTagModalOpen(true);
  // Hàm đóng modal gắn thẻ
  const closeTagModal = () => setIsTagModalOpen(false);

  /**------------------------Quản lý ảnh------------------------ */
  //Hàm xử lý khi danh sách file thay đổi (có sẵn của Ant Design)
  const [fileList, setFileList] = useState([]); // Danh sách tệp đã chọn
  const handleFileChange = ({ file, fileList }) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      message.error(`${file.name} không phải là ảnh hoặc video.`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error(`${file.name} quá lớn. Chỉ cho phép file <= 5MB.`);
      return;
    }
    setFileList(fileList);
  };
  //Hàm xử lý khi xóa file (có sẵn của Ant Design)
  const handleRemove = (file) => {
    //onRemove của Ant Design chỉ truyền một file object duy nhất
    setFileList((listselected) =>
      listselected.filter((item) => item.uid !== file.uid)
    );
    message.info(`${file.name} đã bị xóa.`);
  };

  //hàm đăng bài
  /**chứa các nội dung : chế độ (công khai / bạn bè / mình tôi)
   * nội dung bài text
   * nội dung ảnh
   * danh sách bạn bè được tag
   */
  const [postContent, setPostContent] = useState(""); // Nội dung bài viết
  const [visibility, setVisibility] = useState("PUBLIC"); // Chế độ bài viết

  const handlePost = async () => {
    const formData = new FormData();

    formData.append("content", postContent); // Thêm nội dung bài viết
    formData.append("privacy", visibility); // Thêm chế độ bài viết
    fileList.forEach((file) => {
      formData.append("images", file.originFileObj); // Thêm ảnh vào formData
    });
    const taggedUserIds = taggedFriends.map((friend) => friend.id);
    taggedUserIds.forEach((id) => {
      formData.append("taggedUserIds", id); // Thêm từng ID
    });

    try {
      setIsLoading(true);
      const response = await formUrl.post("/user/posts", formData); // API
      message.success("Bài viết đã được đăng thành công!");
      // Đặt lại các state để xóa dữ liệu trên form
      setPostContent(""); // Xóa nội dung bài viết
      setFileList([]); // Xóa danh sách file đã chọn
      setTaggedFriends([]); // Xóa danh sách bạn bè đã gắn thẻ
      setVisibility("PUBLIC"); // Đặt lại chế độ mặc định
      closeModal();
      onPostCreated();
    } catch (error) {
      message.error("Đăng bài viết không thành công!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/*-------------------- Modal Gắn thẻ --------------------*/}
      <Modal
        title={
          <div className="flex justify-between items-center ">
            <h3>Gắn thẻ người khác</h3>
            <button
              onClick={closeTagModal}
              className="bg-slate-200 text-black font-semibold py-1 px-2 rounded transition duration-300 hover:bg-slate-500 flex items-center justify-center"
            >
              <CloseOutlined />
            </button>
          </div>
        }
        closeIcon={false}
        open={isTagModalOpen}
        onCancel={closeTagModal}
        footer={null}
        centered
      >
        {/* phần hiện modal gắn thẻ */}
        <TagFriends
          isTagModalOpen={isTagModalOpen} // Truyền trạng thái mở modal
          closeTagModal={closeTagModal} // Hàm đóng modal
          taggedFriends={taggedFriends} // Truyền danh sách bạn bè đã gắn thẻ
          setTaggedFriends={setTaggedFriends} // Hàm cập nhật danh sách bạn bè đã gắn thẻ
        />
      </Modal>

      {/* --------------------Modal Tạo bài viết --------------------*/}
      <Modal
        closeIcon={false}
        title={
          <div className="flex items-center justify-between">
            <h3>Tạo bài viết</h3>
            <button
              onClick={closeModal}
              class="bg-slate-200 text-black font-semibold py-1 px-2 rounded transition duration-300 hover:bg-slate-500 flex items-center justify-center"
            >
              <CloseOutlined />
            </button>
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={null} // Ẩn nút mặc định của Modal
        centered
      >
        {/* Nội dung Form bên trong Modal */}
        <div className="mt-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://random.imagecdn.app/200/200"
              alt="User"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {userData?.firstName + " " + userData?.lastName}
              </p>
              <Select
                defaultValue="Công khai"
                style={{ width: 150 }}
                onChange={setVisibility}
              >
                <Option value="PUBLIC">Công khai</Option>
                <Option value="FRIENDS">Bạn bè</Option>
                <Option value="ONLY_ME">Chỉ mình tôi</Option>
              </Select>
            </div>
          </div>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="mt-4 w-full rounded-lg border p-3 text-gray-800 focus:outline-none"
            rows="4"
            placeholder="Thêm vào bài viết của bạn"
          ></textarea>
          <div className="mb-5">
            <h3 className="font-medium text-slate-600">
              Danh sách bạn bè đã gắn thẻ:
            </h3>
            {taggedFriends.map((friend) => (
              <div key={friend.id} className="flex gap-1">
                <Avatar src={friend.avatar} size="small" />
                <span className="text-blue-500 font-semibold cursor-pointer hover:underline">
                  {friend.username}
                </span>
              </div>
            ))}
          </div>
          {/* Hiển thị ảnh nếu file là ảnh */}
          <div className="flex flex-wrap gap-4 mb-4">
            {fileList.map((file) => (
              <FilePreview key={file.uid} file={file} onRemove={handleRemove} />
            ))}
          </div>

          <div className="mt-4 flex space-x-3 text-sm">
            {/* Nút Ảnh/Video */}
            <Upload
              accept="image/*,video/*" // Chỉ cho phép chọn ảnh và video
              fileList={fileList} // Danh sách file hiển thị
              onChange={handleFileChange} // Xử lý thêm file // Ant Design sẽ gửi { file, fileList } vào đây
              onRemove={handleRemove} // Xử lý xóa file
              beforeUpload={() => false} // Tắt tự động upload
              multiple // Cho phép chọn nhiều file
              className="flex-1"
              showUploadList={false} // Ẩn danh sách file mặc định của Ant Design

              //   itemRender={(originNode, file) => <ImagePreview file={file} />} // Tùy chỉnh hiển thị bằng component
            >
              <Button
                icon={<UploadOutlined />}
                className="flex flex-1 items-center justify-center space-x-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <i className="fas fa-images text-green-600"></i>
                <span>Ảnh/Video</span>
              </Button>
            </Upload>

            <Button
              onClick={openTagModal}
              className="flex flex-1 items-center justify-center space-x-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <i className="fas fa-user-tag text-blue-600"></i>
              <span>Gắn thẻ</span>
            </Button>
            <Button className="flex flex-1 items-center justify-center space-x-2 bg-gray-100 text-gray-600 hover:bg-gray-200">
              <i className="far fa-smile text-yellow-600"></i>
              <span>Cảm xúc</span>
            </Button>
          </div>

          <div className="mt-4 flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span>Quảng cáo bài viết</span>
            </label>
          </div>
          <Button
            loading={isLoading}
            type="primary"
            className="mt-4 w-full rounded-lg"
            onClick={handlePost} // Gọi hàm đăng bài
          >
            {isLoading ? "Đang tải" : "Đăng"}
          </Button>
        </div>
      </Modal>
      <div className="flex flex-col rounded-lg bg-white p-3 px-4 shadow dark:bg-neutral-800">
        <div className="mb-2 flex items-center space-x-2 border-b pb-3 dark:border-neutral-700">
          <div className="h-10 w-10">
            <img
              src="https://random.imagecdn.app/200/200"
              className="h-full w-full rounded-full"
              alt="dp"
            />
          </div>
          <Button
            type="text"
            className="h-10 flex-grow rounded-full bg-gray-100 pl-5 text-left text-gray-500 hover:bg-gray-200 focus:bg-gray-300 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-700"
            onClick={openModal}
          >
            What's on your mind,{" "}
            {userData?.firstName + " " + userData?.lastName}?
          </Button>
        </div>
        <div className="-mb-1 flex space-x-3 text-sm font-thin">
          {/* Create Video */}
          <button className="flex h-8 flex-1 items-center justify-center space-x-2 rounded-md text-gray-600 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none dark:text-gray-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
            <div>
              <i className="fas fa-video text-red-600"></i>
            </div>
            <div>
              <p className="font-semibold">Create Video</p>
            </div>
          </button>
          {/* Photos/Video */}
          <button className="flex h-8 flex-1 items-center justify-center space-x-2 rounded-md text-gray-600 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none dark:text-gray-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
            <div>
              <i className="fas fa-images text-green-600"></i>
            </div>
            <div>
              <p className="font-semibold">Photos/Video</p>
            </div>
          </button>
          {/* Feeling/Activity */}
          <button className="flex h-8 flex-1 items-center justify-center space-x-2 rounded-md text-gray-600 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none dark:text-gray-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
            <div>
              <i className="far fa-smile text-yellow-600"></i>
            </div>
            <div>
              <p className="font-semibold">Feeling/Activity</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
