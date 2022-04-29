import { ReactiveController, ReactiveControllerHost } from 'lit';
import { MessageDTO } from './api';
export declare class ChatController implements ReactiveController {
    private timerId?;
    private host;
    messages: MessageDTO[];
    constructor(host: ReactiveControllerHost);
    fetchMessages(): Promise<void>;
    hostConnected(): void;
    hostDisconnected(): void;
}
//# sourceMappingURL=chat-controller.d.ts.map