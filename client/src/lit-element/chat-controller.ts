import { ReactiveController, ReactiveControllerHost } from 'lit'
import { maxBy, uniqBy } from 'lodash/fp'
import { MessageDTO } from '../chat/api'
import { getMessages } from '../chat/chatService'

export class ChatController implements ReactiveController {
  private timerId?: number
  private host: ReactiveControllerHost

  messages: MessageDTO[] = []

  constructor(host: ReactiveControllerHost) {
    this.host = host
    this.host.addController(this)
  }

  async fetchMessages() {
    const lastSeq = maxBy(message => message.seq, this.messages)
    const incomingMessages = await getMessages(lastSeq?.seq || 0)
    this.messages = uniqBy(message => message.seq, [...this.messages, ...incomingMessages])
    this.host.requestUpdate()
  }

  hostConnected() {
    this.timerId = window.setInterval(async () => {
      await this.fetchMessages()
    }, 1000)
  }

  hostDisconnected() {
    clearInterval(this.timerId)
    this.timerId = undefined
  }
}
