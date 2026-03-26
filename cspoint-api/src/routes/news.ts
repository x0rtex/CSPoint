import express, { Router } from "express";
import { getHltvNews } from "../controllers/news";

const router: Router = express.Router();

router.get("/hltv", getHltvNews);

export default router;
