interface IUser {
  bio: string;
  createdAt: string;
  email: string;
  friendRequests: string[];
  friends: string[];
  isVerified: boolean;
  lastSeen: string;
  name: string;
  photo: string;
  role: string;
  theme: string;
  updatedAt: string;
  _id: string;
}

interface IMessage {
  createdAt: string;
  content: string;
  sender: string;
  receiver: string;
  chatId: string;
  status: string;
  updatedAt: string;
  _id: string;
}

interface IChat {
  createdAt: string;
  participants: string[];
  messages?: IMessage[];
  updatedAt: string;
  participantsData?: IUser[];
  _id: string;
}

export type { IUser, IMessage, IChat };
