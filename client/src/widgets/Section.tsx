import { FC } from 'react'

interface SectionProps {
  children?: React.ReactNode
}

export const Section: FC<SectionProps> = ({ children }) => (
  <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>{children}</div>
)
