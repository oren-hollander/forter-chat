import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ChatController } from './chat-controller'

@customElement('chat-view')
export class ChatView extends LitElement {
  private chat = new ChatController(this)

  override render() {
    return html`<div>
      <h1>Chat</h1>
      <div>${this.chat.messages.map(message => html`<div>${message}</div>`)}</div>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'chat-view': ChatView
  }
}
