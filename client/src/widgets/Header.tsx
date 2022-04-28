import { FC } from 'react'

interface HeaderProps {
  children?: React.ReactNode
}

export const Header: FC<HeaderProps> = ({ children }) => (
  <div style={{ fontFamily: 'sans-serif', fontSize: 'small' }}>{children}</div>
)
