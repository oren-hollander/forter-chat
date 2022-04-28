import { MessageDTO, QuestionDTO, AnswerDTO, SimilarQuestionDTO } from './api'
import { has } from 'lodash/fp'

export const isQuestion = (message: MessageDTO): message is QuestionDTO => has('question', message)
export const isAnswer = (message: MessageDTO): message is AnswerDTO => has('answer', message)
export const isSimilarQuestion = (message: MessageDTO): message is SimilarQuestionDTO =>
  has('similarQuestionId', message)

export type MessageType = 'question' | 'answer' | 'similar'

export const getMessageType = (message: MessageDTO): MessageType => {
  if (isQuestion(message)) {
    return 'question'
  } else if (isAnswer(message)) {
    return 'answer'
  } else if (isSimilarQuestion(message)) {
    return 'similar'
  } else {
    throw new Error('Unknown message')
  }
}

const post = async (url: string, body: unknown): Promise<Response> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  return response
}

export const getMessages = async (seq: number): Promise<MessageDTO[]> => {
  const response = await fetch(`/api/chat/messages?seq=${seq}`)
  return await response.json()
}

export const ask = async (question: string): Promise<void> => {
  await post('/api/chat/questions', { question })
}

export const answer = async (questionId: string, answer: string): Promise<void> => {
  await post(`/api/chat/answers/${questionId}`, { answer })
}
