import { LitElement, html } from 'lit'
import { MessageDTO } from '../chat/api'
import { map } from 'lodash/fp'

class ChronologicMessageList extends LitElement {
  static properties = {
    messages: {},
    selectedId: {},
    setSelectedId: {}
  }

  messages: MessageDTO[] = []
  selectedId: string | undefined = undefined
  setSelectedId: () => void = () => {}

  override render() {
    return html` <div>${map(message => html`<message-view .messageId=${} .messages=${this.messages}/>`, this.messages)}</div> `
  }
}

customElements.define('chronologic-message-list', ChronologicMessageList)
