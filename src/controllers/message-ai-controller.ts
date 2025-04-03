import { Request, Response } from 'express'
import { answerUserMessage } from '../usecases/message-ai/answer-user-message'
import { getRanking } from '../usecases/ranking/get-ranking'

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { message } = req.body

    const { response } = await answerUserMessage({ message })
    res.status(200).json({ message: response })
  } catch (error) {
    console.error('Erro ao buscar ranking:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
