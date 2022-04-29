import { FC } from 'react'
import { Content } from '../../widgets/Content'
import { Header } from '../../widgets/Header'
import { ListItem } from '../../widgets/ListItem'
import { Time } from '../../widgets/Time'
import { QuestionDTO } from '../api'
import { getMessage, MessageProps } from './Message'

export const Question: FC<MessageProps> = ({ messageId, messages, onClick, selected }) => {
  const question = getMessage<QuestionDTO>(messageId, messages)

  return (
    <ListItem type="question" selected={selected} onClick={onClick}>
      <Header>Question #{question.seq} </Header>
      <Content>{question.question}</Content>
      <Time>{question.ts}</Time>
    </ListItem>
  )
}
