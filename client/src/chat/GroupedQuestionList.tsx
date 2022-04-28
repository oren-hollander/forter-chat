import { FC } from 'react'
import { getMessageType, isAnswer, isQuestion, isSimilarQuestion } from './chatService'
import { MessagesProps } from './messageList'
import { flow, groupBy, values, sortBy, map, maxBy } from 'lodash/fp'
import { AnswerDTO, MessageDTO, QuestionDTO } from './api'
import { ListItem } from '../widgets/ListItem'
import { Header } from '../widgets/Header'
import { Content } from '../widgets/Content'
import { Time } from '../widgets/Time'

interface GroupQuestionProps {
  question: QuestionDTO
}

const GroupQuestion: FC<GroupQuestionProps> = ({ question }) => (
  <>
    <Header>Question #{question.seq} </Header>
    <Content>{question.question}</Content>
    <Time>{question.ts}</Time>{' '}
  </>
)

interface GroupAnswerProps {
  answer: AnswerDTO
}

const GroupAnswer: FC<GroupAnswerProps> = ({ answer }) => (
  <>
    <Header>Answer #{answer.seq}</Header>
    <Content indent>{answer.answer}</Content>
    <Time>{answer.ts}</Time>
  </>
)

interface QuestionAndAnswersProps {
  messages: MessageDTO[]
}

const QuestionAndAnswers: FC<QuestionAndAnswersProps> = ({ messages }) => {
  return (
    <>
      {map(message => {
        switch (getMessageType(message)) {
          case 'question':
            return <GroupQuestion key={message.id} question={message as QuestionDTO} />
          case 'answer':
            return <GroupAnswer key={message.id} answer={message as AnswerDTO} />
        }
      }, messages)}
    </>
  )
}

export const GroupedQuestionList: FC<MessagesProps> = ({ messages, selectedId, setSelected }) => {
  const latestTs = (messages: MessageDTO[]): string => maxBy(message => message.ts, messages)!.ts

  const questionId = (message: MessageDTO) => {
    if (isQuestion(message)) {
      return message.id
    } else if (isAnswer(message)) {
      return message.questionId
    } else if (isSimilarQuestion(message)) {
      return message.questionId
    }
  }

  const typeOrder = (message: MessageDTO): number => {
    if (isQuestion(message)) {
      return 0
    } else if (isAnswer(message)) {
      return 1
    } else {
      return 2
    }
  }

  const byQuestion = flow(groupBy(questionId), values, sortBy(latestTs), map(sortBy(typeOrder)))(messages)

  return (
    <div>
      {map(
        messages => (
          <ListItem key={questionId(messages[0])} type="similar">
            <QuestionAndAnswers messages={messages} />
          </ListItem>
        ),

        byQuestion
      )}
    </div>
  )
}
