import axios from "axios";
import { Cookies } from "react-cookie";
const baseUrl = axios.create({
    baseURL:"http://localhost:8080/api/v1/",
    headers:{
        "Content-Type" : "application/json",
    },
});
export const formUrl = axios.create({
    baseURL:"http://localhost:8080/api/v1/",
    headers:{
       'Content-Type': 'multipart/form-data', // Đặt header cho multipart
    },
});
const handleaddInterceptors = (instance) => {
  instance.interceptors.request.use(
      async (config) => {
          const cookies = new Cookies(); // Tạo một instance của Cookies và lấy token từ cookie
          const tokenData = cookies.get("data"); // Lấy token từ cookie
          if (tokenData && tokenData.typeToken && tokenData.accessToken) {
              // Nếu có token, thêm vào header Authorization
              config.headers["Authorization"] = `${tokenData.typeToken} ${tokenData.accessToken}`;
          }

          // Kiểm tra nếu userId chưa tồn tại trong localStorage
          const storedUserId = localStorage.getItem("userId");
          if (!storedUserId && tokenData && tokenData.accessToken) {
              try {
                  // Gọi API để lấy userId
                  const response = await axios.get(
                      "http://localhost:8080/api/v1/user/friends/userLogin",
                      {
                          headers: {
                              Authorization: `${tokenData.typeToken} ${tokenData.accessToken}`,
                          },
                      }
                  );
                  console.log("datalocal = ",response.data)
                  const userId = response.data.id; // Lấy userId từ API
                  const userName= response.data.username;
                  const avatar = response.data.info.avatar;
                  // Lưu  vào localStorage

                  if (userId) {
                      localStorage.setItem("userId", userId);
                      console.log("userId đã được lưu vào localStorage:", userId);
                  }
                  if(userName){
                    localStorage.setItem("userName",userName);
                    console.log("userName đã được lưu vào localStorage:", userName);
                  }
                  if(avatar){
                    localStorage.setItem("avatar",avatar);
                    console.log("avatar đã được lưu vào localStorage:", avatar);
                  }
              } catch (error) {
                  console.error("Lỗi khi gọi API lấy userId:", error);
              }
          }

          return config; // Trả về config đã chỉnh sửa
      },
      (error) => {
          // Nếu có lỗi, trả về lỗi để có thể xử lý tiếp
          return Promise.reject(error);
      }
  );
};

// const handleaddInterceptors =(instance)=>{
//     instance.interceptors.request.use(
//     (config) => {
//         const cookies = new Cookies(); // Tạo một instance của Cookies và lấy token từ cookie
//         const tokenData  = cookies.get("data");  // Lấy token từ cookie
//         if (tokenData && tokenData.typeToken && tokenData.accessToken) {// Nếu có token, thêm vào header Authorization
//             config.headers["Authorization"] = `${tokenData.typeToken} ${tokenData.accessToken}`;
//         }


//         // Kiểm tra nếu userId chưa tồn tại trong localStorage
//         const storedUserId =localStorage.getItem("userId");
//         if(!storedUserId && tokenData && tokenData.accessToken){
//           try{
            

//           }catch(error){
//             console.error("Lỗi khi gọi API lấy userId:", error);
//           }
//         }
//         return config;  // Trả về config đã chỉnh sửa
//     },
//     (error) => {
//         // Nếu có lỗi, trả về lỗi để có thể xử lý tiếp
//         return Promise.reject(error);
//     }
// );
// }

handleaddInterceptors(formUrl)
handleaddInterceptors(baseUrl)


  
import { jwtDecode } from "jwt-decode";
export const getCurrentUserId = () => {
  try {
    const cookies = new Cookies();
    const tokenData = cookies.get("data"); // Lấy token từ cookie
    console.log("Token Data:", tokenData); // Debug token

    if (tokenData && tokenData.accessToken) {
      const decodedToken = jwtDecode(tokenData.accessToken); // Giải mã token
      console.log("Decoded Token:", decodedToken); // Debug payload
      return decodedToken.sub || null;
    }
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return null; // Trả về null nếu không giải mã được
  }
}

export default baseUrl;