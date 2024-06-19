"use client";
import { useUserContext } from "@/context/userContext";
import {
  archive,
  chat,
  database,
  group,
  inbox,
  moon,
  sun,
} from "@/utils/Icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { gradientText } from "@/utils/TaiwindStyles";
import { useGlobalContext } from "@/context/globalContext";
import SearchInput from "../SearchInput/SearchInput";
import { useChatContext } from "@/context/chatContext";
import ChatItem from "../ChatItem/ChatItem";
import { IChat, IUser } from "@/types/type";
import SearchResults from "../SearchResults/SearchResults";
import FriendRequests from "../FriendRequests/FriendRequests";

const navButtons = [
  {
    id: 0,
    name: "All Chats",
    icon: inbox,
    slug: "all-chats",
  },
  {
    id: 1,
    name: "Archived",
    icon: archive,
    slug: "archived",
  },
  {
    id: 2,
    name: "Requests",
    icon: group,
    slug: "requests",
    notification: true,
  },
];

function Sidebar() {
  const { user, updateUser, searchResults } = useUserContext();
  const { allChatsData, handleSelectedChat, selectedChat } = useChatContext();
  const {
    showProfile,
    handleProfileToggle,
    handleFriendProfile,
    handleViewChange,
    currentView,
  } = useGlobalContext();
  const { photo, friendRequests } = user;

  // active nav button
  const [activeNav, setActiveNav] = useState(navButtons[0].id);

  const lightTheme = () => {
    updateUser({ theme: "light" });
  };

  const darkTheme = () => {
    updateUser({ theme: "dark" });
  };

  useEffect(() => {
    document.documentElement.className = user.theme;
  }, [user.theme]);

  return (
    <div className="w-[25rem] flex border-r-2 border-white dark:border-[#3C3C3C]/60">
      <div className="p-4 flex flex-col justify-between items-center border-r-2 border-white dark:border-[#3C3C3C]/60">
        <div
          className="profile flex flex-col items-center"
          onClick={() => {
            handleProfileToggle(true);
          }}
        >
          <Image
            src={photo}
            alt="profile"
            width={50}
            height={50}
            className="aspect-square rounded-full object-cover border-2 border-white dark:border-[#3C3C3C]/65
                cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm select-text"
          />
        </div>
        <div className="w-full relative py-4 flex flex-col items-center gap-8 text-[#454e56] text-lg border-2 border-white dark:border-[#3C3C3C]/65 rounded-[30px] shadow-sm">
          {navButtons.map((btn, i: number) => {
            return (
              <button
                key={btn.id}
                className={`${
                  activeNav === i ? `active-nav dark:${gradientText}` : ""
                } relative p-1 flex items-center text-[#454e56] dark:text-white/65`}
                onClick={() => {
                  setActiveNav(btn.id);
                  handleViewChange(btn.slug);
                  handleProfileToggle(false);
                }}
              >
                {btn.icon}

                {btn.notification && (
                  <span className=" absolute -top-2 right-0 w-4 h-4 bg-[#f00] text-white text-xs rounded-full flex items-center justify-center">
                    {friendRequests?.length > 0 ? friendRequests.length : "0"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="p-2 text-[#454e56] text-xl flex flex-col gap-2 border-2 border-white dark:border-[#3C3C3C]/65 rounded-[30px] shadow-sm dark:text-white/65">
          <button
            className={`${
              user?.theme === "light"
                ? `inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#7263f3] to-[#f56693]`
                : ""
            }`}
            onClick={() => lightTheme()}
          >
            {sun}
          </button>
          <span className="w-full h-[2px] bg-white dark:bg-[#3C3C3C]/60"></span>
          <button
            className={`${user?.theme === "dark" ? "text-white" : ""}`}
            onClick={() => darkTheme()}
          >
            {moon}
          </button>
        </div>
      </div>
      <div className="pb-4 flex-1">
        <h2
          className={`px-4 mt-6 font-bold text-2xl ${gradientText} dark:text-white`}
        >
          Messages
        </h2>
        <div className="px-4 mt-2">
          <SearchInput />
        </div>

        {searchResults?.data?.length > 0 && (
          <div className="mt-4">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              {database} Search Results
            </h4>
            <SearchResults />
          </div>
        )}

        {currentView === "all-chats" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              {chat}
              <span>All Chats</span>
            </h4>

            <div className="mt-2">
              {allChatsData.map((chat: IChat) => {
                return (
                  <React.Fragment key={chat._id}>
                    {chat?.participantsData?.map((participant: IUser) => {
                      return (
                        <ChatItem
                          key={participant._id}
                          user={participant}
                          active={
                            !showProfile && selectedChat?._id === chat._id
                          }
                          chatId={chat._id}
                          onClick={() => {
                            handleProfileToggle(false);
                            handleSelectedChat(chat);
                          }}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {currentView === "archived" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              <span>{archive}</span> <span>Archived</span>
            </h4>
            <div className="mt-2">
              <p className="px-4 py-2 text-[#454e56] dark:text-white/65">
                No archived chats
              </p>
            </div>
          </div>
        )}

        {currentView === "requests" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-slate-200`}
            >
              <span className="w-[20px]">{group}</span>
              <span>Friend Requests</span>
            </h4>

            <div className="mt-2">
              {friendRequests?.length > 0 ? (
                <FriendRequests />
              ) : (
                <p className="px-4 py-2 text-[#454e56] dark:text-white/65">
                  There are no friend requests
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
