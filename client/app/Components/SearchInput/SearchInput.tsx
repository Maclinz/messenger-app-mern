"use cleint";
import { searchIcon } from "@/utils/Icons";
import React, { useState } from "react";

function SearchInput() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <form>
      <div className="relative">
        <span className="absolute top-1/2 pl-4 text-[#aaa] translate-y-[-50%] text-xl">
          {searchIcon}
        </span>
        <input
          type="text"
          name="search"
          placeholder="Search here..."
          className="w-full pl-12 pr-2 py-[0.65rem] bg-white dark:bg-transparent border-2 border-white
            dark:border-[#3C3C3C]/60 dark:text-slate-300 rounded-xl text-gray-800  focus:outline-none focus:ring-2 focus:ring-[#ccc] focus:ring-opacity-50 transition duration-300 ease-in-out"
          value={search}
          onChange={handleSearch}
        />
      </div>
    </form>
  );
}

export default SearchInput;
