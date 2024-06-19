import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import errorHandler from "./src/helpers/errorhandler.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import User from "./src/models/auth/UserModel.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
const httpServer = new createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// error handler middleware
app.use(errorHandler);

// socket io logic
let users = [];

const addUser = (userId, socketId) => {
  return (
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
  );
};

// get user
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// remove user ---> on disconnect
const removeUser = async (socketId) => {
  const user = users.find((user) => user.socketId === socketId);

  if (user) {
    // update user lastSeen
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { lastSeen: new Date() },
      { new: true }
    );

    users = users.filter((user) => user.socketId !== socketId);

    // emit the updated user to the client
    io.emit("user disconnected", updatedUser);
  }
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("add user", (userId) => {
    addUser(userId, socket.id);
    // emit all the users to the client

    io.emit("get users", users);
  });

  // send and get message
  socket.on("send message", ({ senderId, receiverId, text }) => {
    console.log("senderId", senderId);
    //find the receiver
    const user = getUser(receiverId);

    // emit the message to the receiver
    if (user) {
      io.to(user.socketId).emit("get message", {
        senderId,
        text,
      });
    } else {
      console.log("User not found");
    }
  });

  // disconnect
  socket.on("disconnect", async () => {
    console.log("a user disconnected", socket.id);
    await removeUser(socket.id);
    io.emit("get users", users);
  });
});

//routes
const routeFiles = fs.readdirSync("./src/routes");

routeFiles.forEach((file) => {
  // use dynamic import
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
});

const server = async () => {
  try {
    await connect();

    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to strt server.....", error.message);
    process.exit(1);
  }
};

server();
