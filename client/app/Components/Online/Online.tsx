"use client";
import { gradientText } from "@/utils/TaiwindStyles";
import React from "react";

function Online() {
  return (
    <div className="h-full relative pt-4 pb-4 flex-1 overflow-hidden">
      <h2
        className={`px-4 mt-2 font-bold text-2xl ${gradientText} dark:text-white`}
      >
        Online Friends
      </h2>
    </div>
  );
}

export default Online;
