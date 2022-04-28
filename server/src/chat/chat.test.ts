import { Chat, isAnswer, Message } from './chat'
import { Collection, MongoClient } from 'mongodb'
import { setupDatabase } from './setupDatabase'
import { filter } from 'lodash/fp'

describe('messages', () => {
  jest.setTimeout(60_000)

  let mongo: MongoClient
  let messages: Collection<Message>
  let chat: Chat

  beforeAll(async () => {
    ;[messages, mongo] = await setupDatabase('chat-test')
    chat = Chat(messages)
  })

  afterAll(async () => {
    await mongo.close()
  })

  beforeEach(async () => {
    await chat.clean()
  })

  test('quesions', async () => {
    await chat.ask('one')
    await chat.ask('two')

    const allMessages = await chat.getMessages(0)
    expect(allMessages).toEqual([
      expect.objectContaining({ question: 'one', seq: 1 }),
      expect.objectContaining({ question: 'two', seq: 2 })
    ])

    const newMessages = await chat.getMessages(1)
    expect(newMessages).toEqual([expect.objectContaining({ question: 'two', seq: 2 })])
  })

  test('similar questions', async () => {
    const question = 'who was the first man on the moon'
    await chat.ask(question)

    const questions = await chat.getSimilarQuestions('moon')
    expect(questions).toEqual([expect.objectContaining({ question })])

    const noQuestions = await chat.getSimilarQuestions('sun')
    expect(noQuestions).toEqual([])
  })

  test('answers', async () => {
    const question = 'who was the first man on the moon'
    const answer = 'Neil Armstrong'

    await chat.ask(question)
    const questions = await chat.getMessages(0)

    const questionId = questions[0]._id
    await chat.answer(questionId, answer)

    const messages = await chat.getMessages(0)
    const answers = filter(isAnswer, messages)

    expect(answers).toEqual([expect.objectContaining({ answer, seq: 2, questionId })])
  })
})
