import express from "express";
import {
  createChat,
  createMessage,
  getAllUserChats,
  getChatMessages,
  getUserById,
} from "../controllers/messeges/messagesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chats", protect, createChat);
router.get("/chats/:userId", protect, getAllUserChats);

// Messages
router.post("/message", protect, createMessage);
router.get("/messages/:chatId", protect, getChatMessages);

// get user by id
router.get("/user/:id", protect, getUserById);

export default router;
