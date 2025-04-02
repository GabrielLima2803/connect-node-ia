import { Router } from "express";
import {
  getAllSubscribers,
  subscriberEvent,
  subscriberInvitesClicks,
  subscriberInvitesCount,
  subscriberRankingPosition,
} from "../controllers/subscription-controller";

const subscriptionRouter = Router();

subscriptionRouter.post("/subscriptions", subscriberEvent);
subscriptionRouter.get("/subscriptions", getAllSubscribers);
subscriptionRouter.get("/subscriptions/:subscriberId/clicks", subscriberInvitesClicks);
subscriptionRouter.get("/subscriptions/:subscriberId/count", subscriberInvitesCount);
subscriptionRouter.get("/subscriptions/:subscriberId/position", subscriberRankingPosition);

export { subscriptionRouter };
