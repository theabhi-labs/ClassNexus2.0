import express from "express"
import { userRegistrationValidator, userLoginValidators, validate } from "../validators/index.js"
import { registerUser, loginUser, logoutUser, getMe, getAllUsers } from "../controllers/user.controller.js"

import { isAuthenticated, isAdmin } from "../middlewares/auth.middlewares.js"

const router = express.Router();

router.post("/register", userRegistrationValidator,validate,registerUser);
router.post("/login", userLoginValidators, validate, loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/me", isAuthenticated, getMe);
router.get("/getUser", isAuthenticated, isAdmin, getAllUsers)

export default router;