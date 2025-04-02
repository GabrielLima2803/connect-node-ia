import { getRanking } from "../usecases/ranking/get-ranking";
import { Request, Response } from "express";


export const getRankingHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getRanking();
    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};