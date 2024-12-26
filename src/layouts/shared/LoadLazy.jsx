import { Spin } from "antd";
import { Suspense } from "react";
const contentStyle = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};
const content = <div style={contentStyle} />;

// tạo component để thay thế phần chuỗi dài trong element
const LoadLazy = ({ children }) => {
  // đang viết theo kiểu destructuring, nếu không thì phải gọi cả 1 prop ra xong chấm đến nó
  return (
    <Suspense
      fallback={
        <Spin tip="Đang tải..." size="large">
          {content}
        </Spin>
      }
    >
      {children}
    </Suspense>
  );
};
export default LoadLazy;

//fallback là prop mặc định  và có Spin để
