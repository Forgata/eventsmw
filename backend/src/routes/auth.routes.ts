import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
} from "../controllers/auth/auth.controller.js";
import {
  RegisterSchema,
  RefreshTokenSchema,
  LogoutSchema,
  LoginSchema,
} from "../schemas/auth/auth.schema.js";
import { validate } from "../middlewares/validation/validate.middleware.js";

const router = Router();

router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(LoginSchema), login);
router.post("/logout", validate(LogoutSchema), logout);
router.post("/refresh", validate(RefreshTokenSchema), refresh);
