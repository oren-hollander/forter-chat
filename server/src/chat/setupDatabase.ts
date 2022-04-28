import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import { Message } from './chat'

const mongoUri = 'mongodb+srv://admin:admin@cluster0.r2zl1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

export const setupDatabase = async (dbName: string): Promise<[Collection<Message>, MongoClient]> => {
  const mongo = new MongoClient(mongoUri, {
    serverApi: ServerApiVersion.v1
  })

  await mongo.connect()

  const messages = mongo.db(dbName).collection<Message>('messages')
  await messages.createIndex({ seq: 1 }, { unique: true })
  await messages.createIndex({ question: 'text' })
  return [messages, mongo]
}
