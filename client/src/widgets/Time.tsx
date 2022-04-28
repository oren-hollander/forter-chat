import { FC } from 'react'
import { formatDistanceToNow } from 'date-fns'

const formatTime = (ts: string): string =>
  new Date(ts).toLocaleTimeString(undefined, { hourCycle: 'h24', timeStyle: 'short' })

interface TimeProps {
  children: string
}

export const Time: FC<TimeProps> = ({ children }) => (
  <div style={{ fontSize: 'x-small', fontFamily: 'sans-serif', paddingTop: '5px' }}>
    {formatTime(children)}({formatDistanceToNow(new Date(children), { addSuffix: true })})
  </div>
)
