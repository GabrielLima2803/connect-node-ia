import { Router } from "express";
import { getRankingHandler } from "../controllers/ranking-controller";

const rankingRouter = Router();

rankingRouter.get("/ranking", getRankingHandler );

export { rankingRouter };