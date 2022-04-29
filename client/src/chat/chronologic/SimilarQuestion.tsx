import { take, sortBy, filter, map } from 'lodash/fp'
import { FC } from 'react'
import { Content } from '../../widgets/Content'
import { Header } from '../../widgets/Header'
import { ListItem } from '../../widgets/ListItem'
import { Section } from '../../widgets/Section'
import { Time } from '../../widgets/Time'
import { SimilarQuestionDTO, QuestionDTO, AnswerDTO } from '../api'
import { isAnswer } from '../chatService'
import { CommonMessageProps, getMessage } from './Message'

export const SimilarQuestion: FC<CommonMessageProps> = ({ messageId, messages }) => {
  const { ts, questionId, similarQuestionId } = getMessage<SimilarQuestionDTO>(messageId, messages)
  const question = getMessage<QuestionDTO>(questionId, messages)
  const similarQuestion = getMessage<QuestionDTO>(similarQuestionId, messages)
  const answers = take(
    3,
    sortBy((answer: AnswerDTO) => answer.seq, filter(isAnswer, messages))
  )

  return (
    <ListItem type="similar">
      <Section>
        <Header>Question #{question.seq}</Header>
        <Content indent>{question.question}</Content>
      </Section>
      <Section>
        <Header>is similar to question #{similarQuestion.seq}</Header>
        <Content indent>{similarQuestion.question}</Content>
      </Section>

      <Header>Top answers</Header>
      {map(answer => {
        const question = getMessage<AnswerDTO>(answer.questionId, messages)
        return (
          <Content indent key={answer.id}>
            <Section>
              <Header>
                Answer #{answer.seq} to question #{question.seq}
              </Header>
              <Content indent>{answer.answer}</Content>
            </Section>
          </Content>
        )
      }, answers)}
      <Time>{ts}</Time>
    </ListItem>
  )
}
