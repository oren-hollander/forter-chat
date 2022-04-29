import { FC } from 'react'
import { Content } from '../../widgets/Content'
import { Header } from '../../widgets/Header'
import { Time } from '../../widgets/Time'
import { AnswerDTO } from '../api'

interface GroupAnswerProps {
  answer: AnswerDTO
}

export const GroupAnswer: FC<GroupAnswerProps> = ({ answer }) => (
  <>
    <Header>Answer #{answer.seq}</Header>
    <Content indent>{answer.answer}</Content>
    <Time>{answer.ts}</Time>
  </>
)
