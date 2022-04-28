import { FC } from 'react'

interface ContentProps {
  children?: React.ReactNode
  indent?: boolean
}

export const Content: FC<ContentProps> = ({ children, indent = false }) => (
  <div style={{ fontFamily: 'sans-serif', paddingLeft: indent ? '10px' : '' }}>{children}</div>
)
