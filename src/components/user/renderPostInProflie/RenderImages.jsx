import React from "react";

export default function RenderImages({ images }) {
  console.log(images);

  const renderImages = () => {
    const count = images.length;

    if (count === 1) {
      return (
        <div className="grid grid-cols-1 max-h-[429px]">
          <img
            src={images[0]?.url}
            alt=""
            className="w-full max-h-[429px] object-cover"
          />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 max-h-[529px]">
          {images.slice(0, 2).map((img, index) => (
            <img
              key={index}
              src={img?.url}
              alt=""
              className="w-full h-full object-cover "
            />
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-rows-[1fr_1fr] grid-cols-2 gap-1 max-h-[529px]">
          <img
            src={images[0]?.url}
            alt=""
            className="row-span-2 col-span-2 w-full h-full object-cover"
          />
          {images.slice(1, 3).map((img, index) => (
            <img
              key={index}
              src={img?.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className="grid grid-cols-2 gap-1 max-h-[529px] overflow-hidden">
          {images.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img?.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      );
    }

    if (count === 5) {
      return (
        <div className="grid grid-rows-[1fr_1fr] grid-cols-2 gap-1 max-h-[529px]">
          {images.slice(0, 2).map((img, index) => (
            <img
              key={index}
              src={img?.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
          <div className="grid grid-cols-3 gap-1 col-span-2">
            {images.slice(2, 5).map((img, index) => (
              <img
                key={index}
                src={img?.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ))}
          </div>
        </div>
      );
    }

    if (count > 5) {
      return (
        <div className="grid grid-rows-[1fr_1fr] grid-cols-2 gap-1 max-h-[529px]">
          {images.slice(0, 2).map((img, index) => (
            <img
              key={index}
              src={img?.url}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
          <div className="relative grid grid-cols-3 gap-1 col-span-2">
            {images.slice(2, 5).map((img, index) => {
              // Xử lý ảnh cuối cùng để hiển thị số ảnh còn lại
              if (index === 2 && count > 5) {
                return (
                  <div
                    key={index}
                    className="relative w-full h-full bg-black bg-opacity-100 flex justify-center items-center text-white font-bold text-xl"
                  >
                    <img
                      src={img?.url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-50  text-white "
                    />
                    +{count - 5}
                  </div>
                );
              }

              return (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              );
            })}
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div className="mt-5 mb-5 max-h-[526px]">
        <div className="image-gallery w-full max-h-[526px] h-full">
          {renderImages()}
        </div>
      </div>
    </>
  );
}

// import React from "react";
// import RenderImage from "../RenderImage";

// export default function App() {
//   const images = [
//     "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?s=612x612&w=0&k=20&c=WWWaejSo6EWGZMZSK7QK6LCfwd0rL2KB3ImCX2VkW4A=",
//     "https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-nen-phong-canh-3d-001.jpg",
//     "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg",
//     "https://png.pngtree.com/thumb_back/fh260/background/20230527/pngtree-beautiful-nature-wallpapers-image_2686855.jpg",
//     "https://kyluc.vn/userfiles/upload/images/modules/news/2016/7/11/0_hinh-anh-thien-nhien-dep-nhat-th-gioi.jpg",
//     "https://img.pikbest.com/origin/09/41/85/916pIkbEsTzRC.jpg!w700wp",
//     "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-phong-canh-dep-24.jpg",
//   ];

//   return (
//     <div className="w-full h-screen p-6 bg-gray-100">
//       <div className="grid grid-cols-[_1fr_2fr_1fr] gap-6">
//         <div className="bg-red-400">Menu</div>
//         <RenderImage images={images} />
//         <div className="bg-blue-400 p-4">Quảng cáo</div>
//       </div>
//     </div>
//   );
// }
