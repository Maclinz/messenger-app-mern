import axios, { all } from "axios";
import React, { useEffect } from "react";
import { useUserContext } from "./userContext";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

const ChatContext = React.createContext();

const serverUrl = "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const { user } = useUserContext();

  const userId = user?._id;

  const router = useRouter();

  //state
  const [chats, setChats] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [allChatsData, setAllChatsData] = React.useState([]);
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [activeChatData, setActiveChatData] = React.useState({});
  const [socket, setSocket] = React.useState(null);
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [arrivedMessage, setArrivedMessage] = React.useState(null);

  useEffect(() => {
    // create a socket connection
    const newSocket = io(serverUrl);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from the server", reason);
    });

    setSocket(newSocket);

    // cleanup when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // prevent emmiting the events if the user is not logged in
    if (!user) return;

    socket?.emit("add user", user._id);
    // listen for changes in the users
    socket?.on("get users", (users) => {
      // fetch all online users
      const getOnlineUsers = async () => {
        try {
          const usersOnline = await Promise.all(
            users.map(async (user) => {
              const userData = await getUserById(user.userId);
              return userData;
            })
          );

          // remove the current user from the list
          const onlineFriends = usersOnline.filter(
            (user) => user._id !== userId
          );

          // check if the current user if friends with the online users
          const isFriends = onlineFriends.filter((friend) =>
            user.friends.includes(friend._id)
          );

          setOnlineUsers(isFriends);
        } catch (error) {
          console.log("Error in getting Online Users", error.message);
        }
      };

      getOnlineUsers();
    });

    // listen for new messages
    socket?.on("get message", (data) => {
      setArrivedMessage({
        sender: data.senderId,
        content: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket?.off("get users");
      socket?.off("get message");
    };
  }, [user]);

  useEffect(() => {
    // check if the arrived message is from a participant in the selected chat
    if (
      arrivedMessage &&
      selectedChat &&
      selectedChat.participants.includes(arrivedMessage.sender)
    ) {
      // update the messages state
      setMessages((prev) => [...prev, arrivedMessage]);
    }
  }, [arrivedMessage, selectedChat?._id]);

  const getUserById = async (id) => {
    try {
      if (!id) return;

      const res = await axios.get(`${serverUrl}/api/v1/user/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error in getUserById", error.message);
    }
  };

  //fetch users chats
  const fetchChats = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`${serverUrl}/api/v1/chats/${userId}`);

      setChats(res.data);
    } catch (error) {
      console.log("Error in fetchChats", error.message);
    }
  };

  // fetch messages for chat
  const fetchMessages = async (chatId, limit = 15, offset = 0) => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/messages/${chatId}`, {
        params: { limit, offset },
      });

      // set messages
      setMessages(res.data);
    } catch (error) {
      console.log("Error in fetcMessages", error.message);
    }
  };

  const fetchAllMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/messages/${chatId}`);

      return res.data;
    } catch (error) {
      console.log("Error in fetchAllMessages", error.message);
    }
  };

  // fetch all chats data
  const getAllChatsData = async () => {
    try {
      const updatedChats = await Promise.all(
        chats.map(async (chat) => {
          const participantsData = await Promise.all(
            // fetch user data for each participant
            chat.participants
              .filter((participant) => participant !== userId)
              .map(async (participant) => {
                const user = await getUserById(participant);
                return user;
              })
          );

          return {
            ...chat,
            participantsData,
          };
        })
      );

      //udate state with the new data
      setAllChatsData(updatedChats);
    } catch (error) {
      console.log("Error in getAllChatsData", error.message);
    }
  };

  // send message
  const sendMessage = async (data) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/message`, data);

      //update the messages state
      setMessages((prev) => [...prev, res.data]);

      // upadte the chats state
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              lastMessage: res.data,
              updatedAt: new Date().toISOString(),
            };
          }

          return chat;
        });

        //move the chat to the top of the list
        updatedChats.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        return updatedChats;
      });

      // emit the message to the receiver
      socket.emit("send message", {
        senderId: data.sender,
        receiverId: activeChatData._id,
        text: data.content,
      });

      return res.data;
    } catch (error) {
      console.log("There was error sending the message", error.message);
    }
  };

  //handle selected chat
  const handleSelectedChat = async (chat) => {
    setSelectedChat(chat);

    // find the user that is not the current user
    const isNotLoggedInUser = chat.participants.find(
      (participant) => participant !== userId
    );

    const data = await getUserById(isNotLoggedInUser);

    setActiveChatData(data);
  };

  // create a new chat
  const createChat = async (senderId, receiverId) => {
    try {
      const res = await axios.post(`${serverUrl}/api/v1/chats`, {
        senderId,
        receiverId,
      });

      // update the chats state
      setChats((prev) => [...prev, res.data]);

      return res.data;
    } catch (error) {
      console.log("Error in createChat", error.message);
    }
  };

  // logout user
  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`);

      // clear all the states
      setChats([]);
      setMessages([]);
      setAllChatsData([]);
      setSelectedChat(null);
      setActiveChatData({});
      setOnlineUsers([]);
      setSocket(null);
      setArrivedMessage(null);

      toast.success("You have been logged out");

      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error in logoutUser", error.message);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [userId]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (chats && user) {
      getAllChatsData();
    }
  }, [chats, user]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        getUserById,
        allChatsData,
        selectedChat,
        handleSelectedChat,
        fetchAllMessages,
        fetchMessages,
        activeChatData,
        sendMessage,
        logoutUser,
        onlineUsers,
        socket,
        setOnlineUsers,
        createChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return React.useContext(ChatContext);
};
