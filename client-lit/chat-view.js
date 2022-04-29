var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ChatController } from './chat-controller';
let ChatView = class ChatView extends LitElement {
    constructor() {
        super(...arguments);
        this.chat = new ChatController(this);
    }
    render() {
        return html `<div>
      <h1>Chat</h1>
      <div>${this.chat.messages.map(message => html `<div>${message}</div>`)}</div>
    </div>`;
    }
};
ChatView = __decorate([
    customElement('chat-view')
], ChatView);
export { ChatView };
//# sourceMappingURL=chat-view.js.map