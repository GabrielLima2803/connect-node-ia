import { Router } from "express";
import { rankingRouter } from "./ranking-router";
import { inviteRouter } from "./invite-router";
import { subscriptionRouter } from "./subscription-router";
import { messageRouter } from "./message-ai-router";

const routes = Router();

routes.use(rankingRouter);
routes.use(subscriptionRouter);
routes.use(inviteRouter);
routes.use(messageRouter)

export {routes};