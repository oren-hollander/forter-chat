import { getMessages } from './chatService';
export class ChatController {
    constructor(host) {
        this.messages = [];
        this.host = host;
        this.host.addController(this);
    }
    async fetchMessages() {
        const lastSeq = maxBy(message => message.seq, this.messages);
        const incomingMessages = await getMessages((lastSeq === null || lastSeq === void 0 ? void 0 : lastSeq.seq) || 0);
        this.messages = uniqBy(message => message.seq, [...this.messages, ...incomingMessages]);
        this.host.requestUpdate();
    }
    // async fetchMessages() {
    //   this.messages.push(`Message #${this.count}`)
    //   this.count++
    //   this.host.requestUpdate()
    // }
    hostConnected() {
        this.timerId = window.setInterval(async () => {
            await this.fetchMessages();
        }, 1000);
    }
    hostDisconnected() {
        clearInterval(this.timerId);
        this.timerId = undefined;
    }
}
//# sourceMappingURL=chat-controller.js.map