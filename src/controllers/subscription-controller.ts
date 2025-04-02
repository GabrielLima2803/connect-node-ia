import { Request, Response } from "express";
import { subscribeToEvent } from "../usecases/subscriptions/subscriber-to-event";
import { getSubscriberInvitesClicks } from "../usecases/subscriptions/get-subscriber-invite-clicks";
import { getSubscriberInvitesCount } from "../usecases/subscriptions/get-subscriber-invites-count";
import { getSubscriberRankingPosition } from "../usecases/subscriptions/get-subscriber-ranking-position";
import z from "zod";
import { getSubscribers } from "../usecases/subscriptions/get-subscribers";

const subscriptionSchema = z.object({
    name: z.string({
      required_error: "Nome é obrigatório", 
      invalid_type_error: "Nome deve ser texto"
    }).min(3, "Mínimo 3 caracteres"),
    email: z.string({
      required_error: "E-mail é obrigatório"
    }).email("Formato inválido"),
    referrer: z.string().nullable().optional().transform(val => val || null) 
  });

  export const subscriberEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const validationResult = subscriptionSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          errors: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        });
        return;
      }
  
      const { name, email, referrer } = validationResult.data;
      const result = await subscribeToEvent({
        name,
        email,
        invitedBySubscriberId: referrer || null
      });
      
      res.status(201).json(result);
    } catch (error) {
      console.error("Erro ao inscrever:", error);
      
      if (error instanceof Error && error.message.includes("Unique constraint")) {
        res.status(409).json({ message: "E-mail já cadastrado" });
        return;
      }
      
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

export const subscriberInvitesClicks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriberId } = req.params;
    const result = await getSubscriberInvitesClicks({ subscriberId });
    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar cliques:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const subscriberInvitesCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriberId } = req.params;
    const result = await getSubscriberInvitesCount({ subscriberId });
   res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar convites:", error);
   res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const subscriberRankingPosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriberId } = req.params;
    const result = await getSubscriberRankingPosition({ subscriberId });
   res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};


export const getAllSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getSubscribers();
    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar convites:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};