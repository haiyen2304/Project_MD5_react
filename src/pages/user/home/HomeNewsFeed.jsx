import React from "react";

import Navbar from "../../../layouts/user/navbar/Navbar";
import LeftSidebar from "../../../layouts/user/leftSidebar/LeftSidebar";
import RightSidebar from "../../../layouts/user/rightSidebar/RightSidebar";
import MainContentContainer from "../../../layouts/user/common/MainContentContainer";
import NewsFeedPage from "../newsfeed/Newsfeed";
import { Outlet } from "react-router-dom";
export default function HomeNewsFeed(props) {
  const { children } = props;
  return (
    <>
      <div className="flex min-h-full w-full flex-col bg-[#f0f2f5] dark:bg-[#18191A]">
        {/* ----------------------------navbar------------------------------ */}
        <Navbar />
        {/**-----====================---------BODY----========================-------- */}
        <Outlet />
      </div>
    </>
  );
}
/**<Navbar />
        <MainContentContainer>
          <div className="flex">
            <LeftSidebar />
             <div className="flex-1">{children}</div> 
            <RightSidebar />
          </div>
        </MainContentContainer> */
