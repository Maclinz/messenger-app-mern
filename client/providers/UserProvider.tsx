"use client";
import React from "react";
import { UserContextProvider } from "../context/userContext";
import { GlobalProvider } from "../context/globalContext";
import { ChatProvider } from "../context/chatContext";

interface Props {
  children: React.ReactNode;
}

function UserProvider({ children }: Props) {
  return (
    <UserContextProvider>
      <GlobalProvider>
        <ChatProvider>{children}</ChatProvider>
      </GlobalProvider>
    </UserContextProvider>
  );
}

export default UserProvider;
