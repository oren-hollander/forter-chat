import { FC } from 'react'
import { map } from 'lodash/fp'
import { MessageDTO, QuestionDTO, AnswerDTO } from '../api'
import { getMessageType } from '../chatService'
import { GroupAnswer } from './GroupAnswer'
import { GroupQuestion } from './GroupQuestion'

interface QuestionAndAnswersProps {
  messages: MessageDTO[]
}

export const QuestionAndAnswers: FC<QuestionAndAnswersProps> = ({ messages }) => {
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
