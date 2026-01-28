import React from 'react'
import type { UserStatus } from '@/types/user.types'
import styles from './StatusBadge.module.scss'

export interface StatusBadgeProps {
  status: UserStatus
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const tagClasses = [
    styles.tag,
    styles[`tag--${status.toLowerCase()}`],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={tagClasses} role="status" aria-label={`Status: ${status}`}>
      {status}
    </span>
  )
}

export default StatusBadge
