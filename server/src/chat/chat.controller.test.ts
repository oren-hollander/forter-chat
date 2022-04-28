import supertest from 'supertest'
import { setupApp } from '../app'
import { Express } from 'express'
import { Server } from 'http'
import { setupDatabase } from './setupDatabase'
import { Collection, MongoClient } from 'mongodb'
import { Chat, Message } from './chat'

describe('chat controller', () => {
  jest.setTimeout(60_000)

  let app: Express
  let mongo: MongoClient
  let messages: Collection<Message>
  let chat: Chat

  beforeAll(async () => {
    ;[messages, mongo] = await setupDatabase('chat-gateway-test')
    chat = Chat(messages)
    app = await setupApp(messages)
  })

  beforeEach(async () => {
    await chat.clean()
  })

  afterAll(async () => {
    await mongo.close()
  })

  test('ask', async () => {
    await supertest(app)
      .post('/api/chat/questions')
      .send({ question: 'question' })
      .set('Accept', 'application/json')
      .expect(200)

    const messages = await chat.getMessages(0)
    expect(messages).toEqual([expect.objectContaining({ seq: 1, question: 'question' })])
  })

  test('answer', async () => {
    const questionId = await chat.ask('question')

    await supertest(app)
      .post(`/api/chat/answers/${questionId.toHexString()}`)
      .send({ answer: 'answer' })
      .set('Accept', 'application/json')
      .expect(200)

    const messages = await chat.getMessages(0)
    expect(messages).toEqual([
      expect.objectContaining({ seq: 1, question: 'question' }),
      expect.objectContaining({ seq: 2, answer: 'answer' })
    ])
  })

  test('get messages', async () => {
    const questionId = await chat.ask('question')
    await chat.answer(questionId, 'answer')

    const similarQuestionId = await chat.ask('similar question')
    await chat.addSimilarQuestion(questionId, similarQuestionId)

    const response = await supertest(app)
      .get('/api/chat/messages?seq=0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body).toEqual([
      expect.objectContaining({ seq: 1, question: 'question' }),
      expect.objectContaining({ seq: 2, answer: 'answer' }),
      expect.objectContaining({ seq: 3, question: 'similar question' }),
      expect.objectContaining({
        seq: 4,
        questionId: questionId.toHexString(),
        similarQuestionId: similarQuestionId.toHexString()
      })
    ])
  })
})
