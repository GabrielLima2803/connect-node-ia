import { Request, Response } from "express";
import { accessInviteLink } from "../usecases/invite/access-invite-link";


export const accessInviteLinkHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { subscriberId } = req.params;
      await accessInviteLink({ subscriberId });
      res.status(200).json({ message: "Link acessado com sucesso" });
    } catch (error) {
      console.error("Erro ao acessar link de convite:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };
  