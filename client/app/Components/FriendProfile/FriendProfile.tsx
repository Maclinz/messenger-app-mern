"use client";
import { useChatContext } from "@/context/chatContext";
import { useGlobalContext } from "@/context/globalContext";
import { block, trash, xMark } from "@/utils/Icons";
import { gradientText } from "@/utils/TaiwindStyles";
import Image from "next/image";
import React from "react";

function FriendProfile() {
  const { activeChatData } = useChatContext();
  const { handleFriendProfile, showFriendProfile } = useGlobalContext();

  const { photo } = activeChatData || {};

  return (
    <div className="py-4 h-full flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <button
          className="px-4 self-start p-1 text-2xl flex items-center gap-8"
          onClick={() => handleFriendProfile(!showFriendProfile)}
        >
          <span className="pl-1 text-[#454e56] dark:text-white/65">
            {xMark}
          </span>
          <span className="text-[16px] font-medium">Contact Info</span>
        </button>
        <Image
          src={photo}
          alt="Profile Picture"
          width={200}
          height={200}
          className="mt-8 self-center rounded-full aspect-square object-cover border-2 border-[white] dark:border-[#3C3C3C]/65 cursor-pointer
            hover:scale-105 transition-transform duration-300 ease-in-out"
        />

        <h2
          className={`mt-2 px-4 font-bold self-center text-2xl ${gradientText} dark:text-slate-100`}
        >
          {activeChatData?.name}
        </h2>
        <p className="self-center">{activeChatData?.email}</p>

        <p className="mt-6 py-4 w-full border-t-2 border-white self-start flex flex-col dark:border-[#3C3C3C]/60">
          <span
            className={`pl-4 font-medium text-[16px] ${gradientText} dark:text-slate-200`}
          >
            About
          </span>
          <span className="pl-4 text-[#454e56] dark:text-white/65">
            {activeChatData?.bio}
          </span>
        </p>
      </div>
      <div className="px-4 pt-4 flex flex-col gap-2 border-t-2 border-white dark:border-[#3C3C3C]/60">
        <button className="text-red-500 font-medium self-start p-1 text-2xl grid grid-cols-[30px_1fr] items-center gap-8 ">
          <span className="flex items-center">{block}</span>
          <span className="text-[16px]">Unfriend User</span>
        </button>
        <button className="text-red-500 font-medium self-start p-1 text-2xl grid grid-cols-[30px_1fr] items-center gap-8">
          <span className="flex items-center">{trash}</span>
          <span className="text-[16px]">Delete Chat</span>
        </button>
      </div>
    </div>
  );
}

export default FriendProfile;
