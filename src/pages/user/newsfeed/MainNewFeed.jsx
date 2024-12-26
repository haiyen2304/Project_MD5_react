import React from "react";
import LeftSidebar from "../../../layouts/user/leftSidebar/LeftSidebar";
import NewsFeedPage from "./Newsfeed";
import RightSidebar from "../../../layouts/user/rightSidebar/RightSidebar";
import { Outlet } from "react-router-dom";

export default function MainNewFeed() {
  return (
    <div className="flex  ">
      {/**--------------------------leftSidebar--------------------------- */}
      <LeftSidebar />
      {/**--------------------------center content--------------------------- */}

      <div className="flex-1">
        <Outlet />
      </div>
      {/**--------------------------Right Sidebar--------------------------- */}
      <RightSidebar />
    </div>
  );
}
