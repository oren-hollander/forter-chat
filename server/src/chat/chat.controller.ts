import { Express } from 'express'
import { ObjectId, WithId } from 'mongodb'
import { Chat, Message, Answer, Question, SimilarQuestion, isAnswer, isQuestion, isSimilarQuestion } from './chat'
import { map, toNumber, take, filter, flow } from 'lodash/fp'
import { QuestionDTO , AnswerDTO, SimilarQuestionDTO, MessageDTO} from './api'

const QuestionDTO = (question: WithId<Question>): QuestionDTO => ({
  id: question._id.toHexString(),
  seq: question.seq,
  ts: question.ts,
  question: question.question
})

const AnswerDTO = (answer: WithId<Answer>): AnswerDTO => ({
  id: answer._id.toHexString(),
  seq: answer.seq,
  ts: answer.ts,
  answer: answer.answer,
  questionId: answer.questionId.toHexString()
})

const SimilarQuestionDTO = (similarQuestion: WithId<SimilarQuestion>): SimilarQuestionDTO => ({
  id: similarQuestion._id.toHexString(),
  seq: similarQuestion.seq,
  ts: similarQuestion.ts,
  questionId: similarQuestion.questionId.toHexString(),
  similarQuestionId: similarQuestion.similarQuestionId.toHexString()
})

const messageToMessageDTO = (message: WithId<Message>): MessageDTO => {
  if (isAnswer(message)) {
    return AnswerDTO(message)
  } else if (isQuestion(message)) {
    return QuestionDTO(message)
  } else if (isSimilarQuestion(message)) {
    return SimilarQuestionDTO(message)
  } else {
    throw new Error('unknown message type')
  }
}

const withDifferentId =
  (id: ObjectId) =>
  (object: WithId<unknown>): boolean =>
    !id.equals(object._id)

export const ChatController = (app: Express, chat: Chat) => {
  app.post('/api/chat/questions', (req, res) => {
    const question = req.body.question

    const askQuestion = async () => {
      const questionId = await chat.ask(question)
      const questions = await chat.getSimilarQuestions(question)
      const similarQuestions = flow(filter(withDifferentId(questionId)), take(3))(questions)

      for (const similarQuestion of similarQuestions) {
        await chat.addSimilarQuestion(questionId, similarQuestion._id)
      }
    }

    askQuestion().then(() => res.sendStatus(200))
  })

  app.post('/api/chat/answers/:questionId', (req, res) => {
    const questionId = ObjectId.createFromHexString(req.params.questionId)
    const answer = req.body.answer

    chat.answer(questionId, answer).then(() => {
      res.sendStatus(200)
    })
  })

  app.get('/api/chat/messages', (req, res) => {
    const seq = toNumber(req.query.seq)
    chat.getMessages(seq).then(messages => {
      const dtos = map(messageToMessageDTO, messages)
      res.send(dtos)
    })
  })
}
