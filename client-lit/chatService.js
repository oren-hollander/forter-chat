export const isQuestion = (message) => message.hasOwnProperty('question');
export const isAnswer = (message) => message.hasOwnProperty('answer');
export const isSimilarQuestion = (message) => message.hasOwnProperty('similarQuestionId');
export const getMessageType = (message) => {
    if (isQuestion(message)) {
        return 'question';
    }
    else if (isAnswer(message)) {
        return 'answer';
    }
    else if (isSimilarQuestion(message)) {
        return 'similar';
    }
    else {
        throw new Error('Unknown message');
    }
};
const post = async (url, body) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return response;
};
export const getMessages = async (seq) => {
    const response = await fetch(`/api/chat/messages?seq=${seq}`);
    return await response.json();
};
export const ask = async (question) => {
    await post('/api/chat/questions', { question });
};
export const answer = async (questionId, answer) => {
    await post(`/api/chat/answers/${questionId}`, { answer });
};
//# sourceMappingURL=chatService.js.map