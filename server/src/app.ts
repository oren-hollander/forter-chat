import express, { Express, json } from 'express'
import { Collection } from 'mongodb'
import { Chat, Message } from './chat/chat'
import { ChatController } from './chat/chat.controller'

export const setupApp = async (messages: Collection<Message>): Promise<Express> => {
  const app = express()
  app.use(json())

  const chat = Chat(messages)

  ChatController(app, chat)

  return app
}
