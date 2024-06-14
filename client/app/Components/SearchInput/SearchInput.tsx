"use cleint";
import { useUserContext } from "@/context/userContext";
import { searchIcon } from "@/utils/Icons";
import React, { useCallback, useEffect, useState } from "react";
import lodash from "lodash";

function SearchInput() {
  const { searchUsers, searchResults, setSearchResults } = useUserContext();
  const [search, setSearch] = useState("");

  // Debounce the search function with a delay of 500ms
  const debouncedSearchUsers = useCallback(
    lodash.debounce((search) => {
      searchUsers(search);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setSearch(query);

    if (query) {
      debouncedSearchUsers(query);
    } else {
      debouncedSearchUsers.cancel();
      setSearchResults([]);
    }
  };

  // cancel the debounce when the component unmounts
  useEffect(() => {
    return () => {
      debouncedSearchUsers.cancel();
    };
  }, [debouncedSearchUsers]);

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
