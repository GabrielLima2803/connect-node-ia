import { Router } from "express";
import { sendMessage } from "../controllers/message-ai-controller";

const messageRouter = Router()

messageRouter.post("/messages", sendMessage)

export { messageRouter }