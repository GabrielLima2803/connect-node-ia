import { Router } from "express";
import { accessInviteLinkHandler } from "../controllers/invite-controller";

const inviteRouter = Router();

inviteRouter.get("/invite/:subscriberId", accessInviteLinkHandler);

export { inviteRouter };