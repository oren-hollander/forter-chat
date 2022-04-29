import { LitElement, html, css } from 'lit'
import { answer, ask } from '../chat/chatService'
import { ChatController } from './chat-controller'
import { classMap } from 'lit/directives/class-map.js'
import './chronologic-message-list'

type Mode = 'chronologic' | 'grouped'

class ChatView extends LitElement {
  static properties = {
    mode: { state: true }
  }

  static styles = css`
    .blue {
      background-color: lightblue;
      color: black;
    }
  `
  private chat = new ChatController(this)

  private selectedQuestionId: string | undefined = undefined
  private mode: Mode = 'chronologic'

  private async askQuestion(e: Event) {
    const input = e.target as HTMLInputElement
    await ask(input.value)
    input.value = ''
    await this.chat.fetchMessages()
  }

  answerQuestion = async (e: Event) => {
    const input = e.target as HTMLInputElement
    await answer(this.selectedQuestionId!, input.value)
    input.value = ''
    await this.chat.fetchMessages()
  }

  override render() {
    return html`<style></style>

      <div>
        <div>
          Select view
          <button
            ?disabled=${this.mode === 'chronologic'}
            class=${classMap({ blue: this.mode === 'chronologic' })}
            @click="${() => {
              this.mode = 'chronologic'
            }}"
          >
            Chronological
          </button>
          <button
            ?disabled=${this.mode === 'grouped'}
            class=${classMap({ blue: this.mode === 'grouped' })}
            @click="${() => {
              this.mode = 'grouped'
            }}"
          >
            Grouped
          </button>
        </div>

        ${this.mode === 'chronologic'
          ? html`<chronologic-message-list
              .messages=${this.chat.messages}
              .selectedId=${this.selectedQuestionId}
              .setSelectedId=${() => {}}
            />`
          : html`<grouped-question-list />`}

        <input type="text" @change="${this.askQuestion}" />
        <button @click="${this.askQuestion}">Q</button>
        <button ?disabled="${this.selectedQuestionId === undefined}" @click="${this.answerQuestion}">A</button>
      </div>`
  }
}

customElements.define('chat-view', ChatView)
