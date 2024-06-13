"use cleint";
import { useUserContext } from "@/context/userContext";
import { formatDateBasedOnTime } from "@/utils/dates";
import Image from "next/image";
import React from "react";

interface ISender {
  content: string;
  createdAt: string;
  status: string;
}

function Sender({ content, createdAt, status }: ISender) {
  const { user } = useUserContext();

  const { photo } = user || {};
  return (
    <div className="mb-2">
      <div className="flex gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-6">
            <h4 className="font-bold text-[#454e56] dark:text-white/60">You</h4>
            <p className="pt-[2px] text-[#aaa] text-xs">
              {formatDateBasedOnTime(createdAt)}
            </p>
          </div>
          <p className="py-[0.25rem] max-w-[360px] w-full self-start px-4 rounded-tr-[30px] rounded-br-[30px] rounded-bl-[30px] border-[#7263f3] bg-[#7263f3] text-white shadow-sm">
            {content}
          </p>
        </div>
        <Image
          src={photo}
          alt="Profile Picture"
          width={50}
          height={50}
          className="rounded-full aspect-square object-cover self-start border-2 border-[white] cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm"
        />
      </div>
    </div>
  );
}

export default Sender;
