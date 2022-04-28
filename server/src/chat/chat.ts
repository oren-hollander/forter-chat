import { has } from 'lodash/fp'
import { ObjectId, WithId, Collection, WithoutId } from 'mongodb'

export interface Question {
  ts: string
  seq: number
  question: string
}

export const Question = (_id: ObjectId, ts: string, seq: number, question: string): WithId<Question> => ({
  _id,
  ts,
  seq,
  question
})

export interface Answer {
  ts: string
  seq: number
  answer: string
  questionId: ObjectId
}

export const Answer = (
  _id: ObjectId,
  ts: string,
  seq: number,
  answer: string,
  questionId: ObjectId
): WithId<Answer> => ({
  _id,
  ts,
  seq,
  answer,
  questionId
})

export interface SimilarQuestion {
  ts: string
  seq: number
  questionId: ObjectId
  similarQuestionId: ObjectId
}

export const SimilarQuestion = (
  _id: ObjectId,
  ts: string,
  seq: number,
  questionId: ObjectId,
  similarQuestionId: ObjectId
): WithId<SimilarQuestion> => ({
  _id,
  ts,
  seq,
  questionId,
  similarQuestionId
})

export type Message = Question | Answer | SimilarQuestion
export type WithoutSeq<T extends Message> = Omit<T, 'seq'>

export const isAnswer = (message: WithId<Message>): message is WithId<Answer> => has('answer', message)
export const isQuestion = (message: WithId<Message>): message is WithId<Question> => has('question', message)
export const isSimilarQuestion = (message: WithId<Message>): message is WithId<SimilarQuestion> =>
  has('similarQuestionId', message)

export interface Chat {
  ask(question: string): Promise<ObjectId>
  answer(questionId: ObjectId, answer: string): Promise<void>
  getMessages(afterSeq: number): Promise<WithId<Message>[]>
  getSimilarQuestions(question: string): Promise<WithId<Question>[]>
  addSimilarQuestion(questionId: ObjectId, similarQuestionId: ObjectId): Promise<void>
  clean(): Promise<void>
}

export const Chat = (messages: Collection<Message>): Chat => {
  const getLastSeq = async (): Promise<number> => {
    const cursor = messages.find().sort({ seq: -1 })
    if (await cursor.hasNext()) {
      const lastMessage = await cursor.next()
      return lastMessage.seq + 1
    } else {
      return 1
    }
  }

  const insertSequentially = async (message: WithoutSeq<Message>): Promise<ObjectId> => {
    while (true) {
      try {
        const nextSeq = await getLastSeq()
        const seqMessage = { ...message, seq: nextSeq } as Message

        const result = await messages.insertOne(seqMessage)
        return result.insertedId
      } catch {}
    }
  }

  const ask = async (questionText: string): Promise<ObjectId> => {
    const question: WithoutSeq<Question> = { ts: new Date().toISOString(), question: questionText }
    return insertSequentially(question)
  }

  const answer = async (questionId: ObjectId, answerText: string): Promise<void> => {
    const answer: WithoutSeq<Answer> = { ts: new Date().toISOString(), answer: answerText, questionId }
    await insertSequentially(answer)
  }

  const getMessages = async (afterSeq: number = 0): Promise<WithId<Message>[]> => {
    const cursor = messages.find({ seq: { $gt: afterSeq } })
    return cursor.toArray()
  }

  const getSimilarQuestions = async (question: string): Promise<WithId<Question>[]> => {
    const cursor = messages.find({ $text: { $search: question } })
    return cursor.toArray() as unknown as WithId<Question>[]
  }

  const addSimilarQuestion = async (questionId: ObjectId, similarQuestionId: ObjectId): Promise<void> => {
    const similarQuestion: WithoutSeq<SimilarQuestion> = { ts: new Date().toISOString(), questionId, similarQuestionId }
    await insertSequentially(similarQuestion)
  }

  const clean = async (): Promise<void> => {
    await messages.deleteMany({})
  }

  return {
    ask,
    answer,
    getMessages,
    getSimilarQuestions,
    addSimilarQuestion,
    clean
  }
}
