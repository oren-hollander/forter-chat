export interface QuestionDTO {
    id: string;
    ts: string;
    seq: number;
    question: string;
}
export interface AnswerDTO {
    id: string;
    ts: string;
    seq: number;
    answer: string;
    questionId: string;
}
export interface SimilarQuestionDTO {
    id: string;
    ts: string;
    seq: number;
    questionId: string;
    similarQuestionId: string;
}
export declare type MessageDTO = QuestionDTO | AnswerDTO | SimilarQuestionDTO;
//# sourceMappingURL=api.d.ts.map