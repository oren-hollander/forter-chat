import { Dispatch, FC, SetStateAction } from 'react'
import { isQuestion } from '../chatService'
import { Message } from './Message'
import { map } from 'lodash/fp'
import { MessageDTO } from '../api'

interface ChronologicMessageListProps {
  messages: MessageDTO[]
  selectedId: string | undefined
  setSelected: Dispatch<SetStateAction<string | undefined>>
}

export const ChronologicMessageList: FC<ChronologicMessageListProps> = ({ messages, selectedId, setSelected }) => {
  return (
    <div>
      {map(
        message => (
          <Message
            key={message.id}
            messageId={message.id}
            messages={messages}
            onClick={() => {
              if (isQuestion(message)) {
                setSelected(id => (id === message.id ? undefined : message.id))
              }
            }}
            selected={selectedId === message.id}
          />
        ),
        messages
      )}
    </div>
  )
}
