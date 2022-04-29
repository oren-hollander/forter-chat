import { FC } from 'react'
import { isAnswer, isQuestion, isSimilarQuestion } from '../chatService'
import { flow, groupBy, values, sortBy, map, maxBy } from 'lodash/fp'
import { MessageDTO } from '../api'
import { ListItem } from '../../widgets/ListItem'
import { QuestionAndAnswers } from './QuestionAndAnswers'

interface GroupedQuestionListProps {
  messages: MessageDTO[]
}

export const GroupedQuestionList: FC<GroupedQuestionListProps> = ({ messages }) => {
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
