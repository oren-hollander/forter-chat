import { FC } from 'react'
import { MessageDTO } from '../api'
import { isAnswer, isQuestion, isSimilarQuestion } from '../chatService'
import { find } from 'lodash/fp'
import { Question } from './Question'
import { Answer } from './Answer'
import { SimilarQuestion } from './SimilarQuestion'

export const getMessage = <T extends MessageDTO>(messageId: string, messages: MessageDTO[]): T =>
  find(message => message.id === messageId, messages)! as T

export interface CommonMessageProps {
  messageId: string
  messages: MessageDTO[]
}

export interface MessageProps extends CommonMessageProps {
  onClick(): void
  selected: boolean
}

export const Message: FC<MessageProps> = ({ messageId, messages, onClick, selected }) => {
  const message = find(message => message.id === messageId, messages)!
  if (isQuestion(message)) {
    return <Question messageId={messageId} messages={messages} onClick={onClick} selected={selected} />
  } else if (isAnswer(message)) {
    return <Answer messageId={messageId} messages={messages} />
  } else if (isSimilarQuestion(message)) {
    return <SimilarQuestion messageId={messageId} messages={messages} />
  } else {
    return null
  }
}
