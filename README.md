# Forter Chat

## Setup

### Run the server

```console
> cd server
> npm i
> npm start
```

### Run the client

```console
> cd client
> npm i
> npm start
```

### Use the app

Open http://localhost:3000

## Data Model

The database chosen is MongoDB hosted on Atlas.

There is one database named `chat` containing one collection named `messages`.

The messages collection holds documents of type `Message`.

A `Message` is either a `Question`, an `Answer` or a `SimilarQuestion`.

Here are the TypeScript type definitions for the data model:

```typescript
interface Question {
  _id: ObjectId;
  ts: string;
  seq: number;
  question: string;
}

interface Answer {
  _id: ObjectId;
  ts: string;
  seq: number;
  answer: string;
  questionId: ObjectId;
}

interface SimilarQuestion {
  _id: ObjectId;
  ts: string;
  seq: number;
  questionId: ObjectId;
  similarQuestionId: ObjectId;
}

type Message = Question | Answer | SimilarQuestion;
```

There are two indices defined for the `messages` collection.

1. Numeric index on the `seq` field - used to maintain sequence order between messages

2. Text index on the `question` field - used to search for similar question

Whenever a user asks a question, a `Question` document is added to the `messages` collection.

When a questions is asked, a bot will look for similar questions. When such questions are found, the bot will add a `SimilarQuestion` documnet to the `messages` collection for the top 3 matches.

Whenever a user answers a question, an `Answer` document is addes to the `messages` collection.

All messages in the `messages` collection has a field named `seq` which is a sequential number starting from 1. The implementation takes care of maintaining this sequence number.

## Server API

The server has 3 HTTP endpoints:

1. Ask a question

```
POST /api/chat/questions
Body: {"question": "<question text>"}
```

2. Answer a question

```
POST /api/chat/answers/:questionId
Body: {"answer": "<answer text>"}
```

3. Get all messages with a sequence number greater then provided

```
GET /api/chat/messages/?seq=<sequence number>
Result: Message[]
```

## Client Details

The client is developed using React as a single page application. The main `Chat` view is responsible for 3 things:

1. Periodically fecth new messages. To do so it calls the `/api/chat/messages` endpoint passing the latest message sequence number it received. When the app first loads and has no messages yet, it passes 0.

2. Show UI for asking and answering questions and issue requests to the server.

3. Display the messages

The messages display has two views: chnologic and grouped.

### Asking and answering questions

At the bottom of the chat view there is an input box and two numbers, one for asking and the other for answering a question. To ask a question, the user writes the question in the box and clicks the `Q` button. To answer a question the user selects a question from the list, write the answer in the box and clicks the `A` button.

### Cronologic view

In this view the messages are displayed according the their sequence number in chronological order. Each type of message has a different format so the user can distinguish between questions, answers and bot generated similar questions

### Grouped view

In this view questions and answers are grouped by the question and sorted by latest sequence number of the group
