import { FC } from 'react'
import { isQuestion } from './chatService'
import { Message } from './Message'
import { MessagesProps } from './messageList'
import { map } from 'lodash/fp'

export const ChronologicMessageList: FC<MessagesProps> = ({ messages, selectedId, setSelected }) => {
  return (
    <div>
      {map(
        (message) => (
          <Message
            key={message.id}
            messageId={message.id}
            messages={messages}
            onClick={() => {
              if (isQuestion(message)) {
                setSelected((id) => (id === message.id ? undefined : message.id))
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
