import React, { useEffect, useState } from "react";
// phần leftsidebar
import { FaUserFriends, FaBirthdayCake } from "react-icons/fa";
import { RiMemoriesFill, RiMessengerLine, RiPagesFill } from "react-icons/ri";
import { GrSave } from "react-icons/gr";
import { MdGroups2, MdVideoLibrary, MdEventSeat } from "react-icons/md";
import { SiYoutubegaming } from "react-icons/si";
import { PiFilmReelFill } from "react-icons/pi";
import { FaFacebookMessenger } from "react-icons/fa";
import { Link } from "react-router-dom";
import { message } from "antd";
export default function LeftSidebar() {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const avatar = localStorage.getItem("avatar");

  const [currentUserId, setCurrentUserId] = useState(null); // Lưu ID người dùng hiện tại
  // By Hung
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId); // Lưu ID vào state
    } else {
      message.error("Không tìm thấy userId trong localStorage.");
    }
  }, [currentUserId]);
  // By Hung

  return (
    <>
      <div className="sticky top-[56px] h-[calc(100vh-56px)] w-[22.5rem] overflow-y-auto px-2 py-3">
        <ul className="text-black dark:text-gray-200">
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <Link
              to={`/profile/${currentUserId}`}
              className="flex items-center gap-3"
            >
              <div>
                <img className="h-8 w-8 rounded-full" src={avatar} alt="user" />
              </div>
              <div>
                <p className="text-sm font-semibold">{userName}</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to={"/friends"}
              className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800"
            >
              <div>
                <FaUserFriends className="h-8 w-8 rounded-full" />
              </div>
              <div>
                <p className="text-sm font-semibold">Friends</p>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to={"/messenger"}
              className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800"
            >
              <div>
                <FaFacebookMessenger className="h-8 w-8 rounded-full bg-no-repeat" />
              </div>
              <div>
                <p className="text-sm font-semibold">Messenger</p>
              </div>
            </Link>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <RiMemoriesFill className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Memories</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <GrSave className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Saved</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <MdGroups2 className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Groups</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <MdVideoLibrary className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Video</p>
            </div>
          </li>
          {/* <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <SiMarketo className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Marketplace</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <img
                className="h-8 w-8 rounded-full"
                src="https://random.imagecdn.app/32/37"
                alt="groups"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Feeds</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <img
                className="h-8 w-8 rounded-full"
                src="https://random.imagecdn.app/32/38"
                alt="groups"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Ads Manager</p>
            </div>
          </li>
          
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <img
                className="h-8 w-8 rounded-full"
                src="https://random.imagecdn.app/32/41"
                alt="groups"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Fundraisers</p>
            </div>
          </li> */}
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <MdEventSeat className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Events</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <SiYoutubegaming className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Gaming video</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <RiMessengerLine className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Messenger kids</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <PiFilmReelFill className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Reels</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <RiPagesFill className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">Pages</p>
            </div>
          </li>
          <li className="justify-content mb-2 flex h-12 cursor-pointer items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-neutral-800">
            <div>
              <FaBirthdayCake className="h-8 w-8 rounded-full" />
            </div>
            <div>
              <p className="text-sm font-semibold">brithDay</p>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
