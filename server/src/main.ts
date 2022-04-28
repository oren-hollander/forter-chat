import { setupApp } from './app'
import { setupDatabase } from './chat/setupDatabase'

const main = async () => {
  const port = 3001
  const [messages] = await setupDatabase('chat')

  const app = await setupApp(messages)

  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`)
  })
}

main()
