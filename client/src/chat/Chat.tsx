import { FC, useCallback, useEffect, useState } from 'react'
import { ask, answer, getMessages } from './chatService'
import { MessageDTO } from './api'
import { maxBy, uniqBy } from 'lodash/fp'
import { ChronologicMessageList } from './chronologic/ChronologicMessageList'
import { GroupedQuestionList } from './grouped/GroupedQuestionList'

type Mode = 'chronologic' | 'grouped'

export const Chat: FC = () => {
  const [messages, setMessages] = useState<MessageDTO[]>([])
  const [message, setMessage] = useState('')
  const [selecedQuestionId, setSelectedQuestionId] = useState<string>()
  const [mode, setMode] = useState<Mode>('chronologic')

  const fetchMessages = useCallback(async () => {
    const lastSeq = maxBy(message => message.seq, messages)
    const incomingMessages = await getMessages(lastSeq?.seq || 0)
    setMessages(messages => uniqBy(message => message.seq, [...messages, ...incomingMessages]))
  }, [messages])

  useEffect(() => {
    const timerId = setInterval(fetchMessages, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [fetchMessages])

  const askQuestion = async () => {
    await ask(message)
    setMessage('')
    await fetchMessages()
  }

  const answerQuestion = async () => {
    await answer(selecedQuestionId!, message)
    setMessage('')
    await fetchMessages()
  }

  return (
    <div>
      <div>
        Select view{' '}
        <button
          style={{ backgroundColor: mode === 'chronologic' ? 'lightblue' : '' }}
          onClick={() => setMode('chronologic')}
        >
          Chronological
        </button>
        <button style={{ backgroundColor: mode === 'grouped' ? 'lightblue' : '' }} onClick={() => setMode('grouped')}>
          Grouped
        </button>
      </div>

      {mode === 'chronologic' && (
        <>
          <ChronologicMessageList
            messages={messages}
            selectedId={selecedQuestionId}
            setSelected={setSelectedQuestionId}
          />
          <div>
            <input style={{ width: '25em' }} type="text" value={message} onChange={e => setMessage(e.target.value)} />
            <button onClick={askQuestion}>Q</button>
            <button disabled={selecedQuestionId === undefined} onClick={answerQuestion}>
              A
            </button>
          </div>
        </>
      )}

      {mode === 'grouped' && <GroupedQuestionList messages={messages} />}
    </div>
  )
}
