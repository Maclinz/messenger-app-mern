import express from "express";
import {
  acceptFriendRequest,
  changePassword,
  forgotPassword,
  friendRequest,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  searchUsers,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
} from "../controllers/auth/adminController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// admin route
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// get all users
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// login status
router.get("/login-status", userLoginStatus);

// email verification
router.post("/verify-email", protect, verifyEmail);

// veriify user --> email verification
router.post("/verify-user/:verificationToken", verifyUser);

// forgot password
router.post("/forgot-password", forgotPassword);

//reset password
router.post("/reset-password/:resetPasswordToken", resetPassword);

// change password ---> user must be logged in
router.patch("/change-password", protect, changePassword);

// seacrh users
router.get("/search-users", protect, searchUsers);

//friend request
router.post("/friend-request", protect, friendRequest);

// accept friend request
router.post("/friends/accept", protect, acceptFriendRequest);

export default router;
