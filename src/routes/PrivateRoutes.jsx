import LoadLazy from "../layouts/shared/LoadLazy";
import React from "react";
import MainNewFeed from "../pages/user/newsfeed/MainNewFeed";
import NewsFeedPage from "../pages/user/newsfeed/Newsfeed";
import Admin from "../pages/superAdmin/Admin";
import ManageAccounts from "../pages/superAdmin/ManageAccounts";
import ManagePosts from "../pages/superAdmin/ManagePosts";
import ReportPosts from "../pages/superAdmin/ReportPosts";
import ReportUsers from "../pages/superAdmin/ReportUsers";
import PrivateMessage from "../pages/user/message/PrivateMessage";
import FormPost from "../pages/user/formpost/FormPost";
import Authorization from "../components/authorization/Authorization";
import MainFriend from "../pages/user/friends/MainFriend";

import ManagerGroup from "../pages/superAdmin/ManagerGroup";

import HomeFriend from "../pages/user/friends/sideBar/HomeFriend";
import Hint from "../pages/user/friends/sideBar/Hint";
import Sendered from "../pages/user/friends/sideBar/Sendered";
import ListFriendNow from "../pages/user/friends/sideBar/ListFriendNow";
import BlockedFriends from "../pages/user/friends/sideBar/BlockedFriend";
import MessageComponent from "../pages/user/messenger/MessageComponent";
import ManageComment from "../pages/superAdmin/ManageComment";
import PrivateRoute from "../components/privateRoute/PrivateRoute";

import Login from "../pages/user/login";
import Dashboard from "../pages/superAdmin/Dashboard";
// import HomeNewsFeed from "../pages/user/home/HomeNewsFeed";
const Friends = React.lazy(() => import("../components/friend/Friends"));
const Groups = React.lazy(() => import("../pages/user/group"));
const Profile = React.lazy(() => import("../pages/user/profile/Profile"));
const ProfileEdit = React.lazy(() =>
  import("../pages/user/profile/profileEdit")
);
const GroupBlog = React.lazy(() => import("../pages/user/group/GroupsBlog"));
const GroupMain = React.lazy(() => import("../pages/user/group/GroupHeader"));
const GroupMember = React.lazy(() => import("../pages/user/group/GroupMember"));

const CurrentGroup = React.lazy(() => import("../pages/user/group/"));
const Messenger = React.lazy(() => import("../pages/user/messenger/Messenger"));
const FriendInvitation = React.lazy(() =>
  import("../pages/user/friends/FriendInvitation")
);
const FriendsList = React.lazy(() =>
  import("../pages/user/friends/FriendsList")
);
const HomeNewsFeed = React.lazy(() =>
  import("../pages/user/home/HomeNewsFeed")
);

const CreateStory = React.lazy(() =>
  import("../pages/user/createStory/CreateStory")
);

const CreateGroup = React.lazy(() =>
  import("../pages/user/createGroup/CreateGroup")
);
const PrivateRoutes = [
  // Các route riêng tư
  {
    path: "/",
    element: (
      <PrivateRoute>
        <LoadLazy>
          <Authorization roleName={"ROLE_USER"}>
            <HomeNewsFeed />
          </Authorization>
        </LoadLazy>
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <MainNewFeed />,
        children: [
          {
            path: "",
            element: <NewsFeedPage />,
          },
        ],
      },

      { path: "profile/:userId", element: <LoadLazy children={<Profile />} /> },

      {
        path: "profileEdit/:userId",
        element: <LoadLazy children={<ProfileEdit />} />,
      },

      {
        path: "groupBlog",
        element: <LoadLazy children={<GroupBlog />} />,
      },

      {
        path: "group/:groupId",
        element: <LoadLazy children={<GroupBlog />} />,
      },
      {
        path: "groupMain/:groupId",
        element: <LoadLazy children={<GroupMain />} />,
      },
      {
        path: "groupMember/:groupId",
        element: <LoadLazy children={<GroupMember />} />,
      },
      {
        path: "friends",
        element: <LoadLazy children={<MainFriend />} />,
        children: [
          {
            index: true,
            element: <LoadLazy children={<HomeFriend />} />,
          },
          {
            path: "sender",
            element: <LoadLazy children={<Sendered />} />,
          },
          {
            path: "hint",
            element: <LoadLazy children={<Hint />} />,
          },
          {
            path: "listFriendNow",
            element: <LoadLazy children={<ListFriendNow />} />,
          },
          {
            path: "block",
            element: <LoadLazy children={<BlockedFriends />} />,
          },
        ],
      },

      {
        path: "messenger",
        element: <Messenger />,
        children: [
          {
            index: true,
            element: (
              <div className="text-[40px] text-[#cecece] h-full flex justify-center items-center">
                <p>Hãy chọn một người tử tế để bắt đầu trò chuyện.</p>
              </div>
            ),
          },
          {
            path: "/messenger/chat/:id",
            element: <MessageComponent />,
          },
        ],
      },
      {
        path: "createStory",
        element: <CreateStory />,
      },
      {
        path: "createGroup",
        element: <CreateGroup />,
      },
    ],
  },

  {
    path: "/superAdmin",
    element: (
      <LoadLazy>
        <Authorization roleName={"ROLE_SUPER_ADMIN"}>
          <Admin />,
        </Authorization>
      </LoadLazy>
    ),
    children: [
      {
        index: true,
        element: <LoadLazy children={<Dashboard />} />,
      },
      {
        path: "manage-accounts",
        element: <LoadLazy children={<ManageAccounts />} />,
      },
      {
        path: "manage-posts",
        element: <LoadLazy children={<ManagePosts />} />,
      },
      {
        path: "manage-groups",
        element: <LoadLazy children={<ManagerGroup />} />,
      },
      {
        path: "report-posts",
        element: <LoadLazy children={<ReportPosts />} />,
      },
      {
        path: "report-users",
        element: <LoadLazy children={<ReportUsers />} />,
      },
      {
        path: "manage-comments",
        element: <LoadLazy children={<ManageComment />} />,
      },
    ],
  },
  {
    path: "/private-message",
    element: <PrivateMessage />,
  },
  {
    path: "/form-post",
    element: <FormPost />,
  },
];
export default PrivateRoutes;
