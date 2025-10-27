
//backend/routes/kidRoutes.js
import express from "express";
import { getContentForKids } from "../controllers/kidController.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/content", isAuth, getContentForKids);

export default router;