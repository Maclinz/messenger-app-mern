import { send } from "@/utils/Icons";
import React, { useEffect, useRef, useState } from "react";

function TextArea() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const autoResize = () => {
    const textarea = textAreaRef.current;

    if (textarea) {
      textarea.style.height = "auto"; //reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; //set the height to the scrollHeight

      if (textarea.scrollHeight > 350) {
        textarea.style.overflowY = "auto";
        textarea.style.height = "350px";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  };

  useEffect(() => {
    autoResize();
  }, [message]);

  return (
    <form className="relative flex items-center">
      <div className="relative flex-1">
        <textarea
          className="textarea w-full px-4 py-3 border-2 rounded-[30px] border-white bg-[#F6F5F9] dark:bg-[#262626] dark:text-gray-100 text-[#12181b] dark:border-[#3C3C3C]/65 
          shadow-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent focus:ring-[#ccc] focus:ring-opacity-50 transition duration-300 ease-in-out"
          rows={1}
          value={message}
          ref={textAreaRef}
          onChange={handleOnChange}
        ></textarea>
        <button
          type="button"
          className="absolute top-[22px] right-3 text-[#aaa] translate-y-[-50%] text-2xl"
        >
          🥹
        </button>
        {!message && (
          <span className="absolute text-sm top-[46%] left-4 text-[#aaa] translate-y-[-50%] pointer-events-none">
            Type a message...
          </span>
        )}
      </div>
      <button
        type="submit"
        disabled={!message || !message.trim()}
        className="px-4 self-start py-2 w-12 h-12 bg-[#7263f3] text-white rounded-full ml-2 shadow-sm"
      >
        {send}
      </button>
    </form>
  );
}

export default TextArea;
