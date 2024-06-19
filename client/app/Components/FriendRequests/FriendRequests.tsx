"use cleint";
import { useChatContext } from "@/context/chatContext";
import { useUserContext } from "@/context/userContext";
import { IUser } from "@/types/type";
import { ban, check } from "@/utils/Icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function FriendRequests() {
  const { user, acceptFriendRequest } = useUserContext();
  const { getUserById, createChat } = useChatContext();

  const { friendRequests } = user;

  const [requests, setRequests] = useState<IUser[]>([]);

  useEffect(() => {
    // fetch frind requests data
    const fetchRequests = async () => {
      const requestData = await Promise.all(
        friendRequests.map(async (id: string) => {
          const userData = await getUserById(id);
          return userData;
        })
      );

      // update state with fetched data
      setRequests(requestData);
    };

    // trigger data fetching if there are friend requests
    if (friendRequests && friendRequests.length > 0) {
      fetchRequests();
    }
  }, [friendRequests, getUserById]);

  //sort by date
  const sortedRequests = requests.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {requests.length > 0 && (
        <div>
          {sortedRequests.map((request: IUser) => {
            const { friends } = request;
            return (
              <div
                key={request._id}
                className="flex justify-between items-center p-4 border-b-2 cursor-pointer
                border-white dark:border-[#3C3C3C]/60 hover:bg-blue-50 dark:hover:bg-white/5 transition-all duration-300 ease-in-out"
              >
                <div className="flex gap-3">
                  <Image
                    src={request.photo}
                    alt="profile"
                    width={50}
                    height={50}
                    className="rounded-full aspect-square object-cover"
                  />

                  <div>
                    <h3 className="font-medium ">{request.name}</h3>
                    <p className="text-[#aaa] text-sm">
                      {friends.length === 1
                        ? `${friends.length} friend`
                        : `${friends.length} friends`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center h-[2.5rem] w-[2.5rem] bg-[#f56693] text-white px-4 py-2 rounded-full">
                    {ban}
                  </button>
                  <button
                    className="flex items-center justify-center h-[2.5rem] w-[2.5rem] bg-[#7263f3] text-white px-4 py-2 rounded-full"
                    onClick={() => {
                      acceptFriendRequest({
                        requestingUserId: request._id,
                      });

                      createChat(user._id, request._id);
                    }}
                  >
                    {check}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FriendRequests;
