import { MessageDTO, QuestionDTO, AnswerDTO, SimilarQuestionDTO } from './api';
export declare const isQuestion: (message: MessageDTO) => message is QuestionDTO;
export declare const isAnswer: (message: MessageDTO) => message is AnswerDTO;
export declare const isSimilarQuestion: (message: MessageDTO) => message is SimilarQuestionDTO;
export declare type MessageType = 'question' | 'answer' | 'similar';
export declare const getMessageType: (message: MessageDTO) => MessageType;
export declare const getMessages: (seq: number) => Promise<MessageDTO[]>;
export declare const ask: (question: string) => Promise<void>;
export declare const answer: (questionId: string, answer: string) => Promise<void>;
//# sourceMappingURL=chatService.d.ts.map