import { FC } from 'react'
import { Content } from '../../widgets/Content'
import { Header } from '../../widgets/Header'
import { ListItem } from '../../widgets/ListItem'
import { Time } from '../../widgets/Time'
import { AnswerDTO, QuestionDTO } from '../api'
import { CommonMessageProps, getMessage } from './Message'

export const Answer: FC<CommonMessageProps> = ({ messageId, messages }) => {
  const answer = getMessage<AnswerDTO>(messageId, messages)
  const question = getMessage<QuestionDTO>(answer.questionId, messages)

  return (
    <ListItem type="answer">
      <Header>
        Answer #{answer.seq} to question #{question.seq}
      </Header>
      <Content>{question.question}</Content>
      <Content indent>{answer.answer}</Content>
      <Time>{answer.ts}</Time>
    </ListItem>
  )
}
