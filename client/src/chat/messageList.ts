import { Dispatch, SetStateAction } from 'react'
import { MessageDTO } from './api'

export interface MessagesProps {
  messages: MessageDTO[]
  selectedId: string | undefined
  setSelected: Dispatch<SetStateAction<string | undefined>>
}
