import { FC } from 'react'
import { Content } from '../../widgets/Content'
import { Header } from '../../widgets/Header'
import { Time } from '../../widgets/Time'
import { QuestionDTO } from '../api'

interface GroupQuestionProps {
  question: QuestionDTO
}

export const GroupQuestion: FC<GroupQuestionProps> = ({ question }) => (
  <>
    <Header>Question #{question.seq} </Header>
    <Content>{question.question}</Content>
    <Time>{question.ts}</Time>{' '}
  </>
)
