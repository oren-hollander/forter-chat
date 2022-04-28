import { FC } from 'react'
import { MessageType } from '../chat/chatService'

interface ListItemProps {
  children?: React.ReactNode
  selected?: boolean
  onClick?(): void
  type: MessageType
}

export const ListItem: FC<ListItemProps> = ({ children, selected = false, onClick, type }) => {
  const getColor = (type: MessageType): string => {
    switch (type) {
      case 'answer':
        return 'lightgreen'
      case 'question':
        return 'lightyellow'
      case 'similar':
        return 'lightgrey'
    }
  }

  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : '',
        backgroundColor: getColor(type),
        border: selected ? '2px solid darkblue' : '2px solid darkgrey',
        padding: '2px',
        margin: '2px'
      }}
    >
      {children}
    </div>
  )
}
