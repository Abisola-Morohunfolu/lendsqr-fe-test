import React from 'react'
import styles from './Loader.module.scss'

export interface LoaderProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  fullScreen?: boolean
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  className = '',
  fullScreen = false,
}) => {
  const wrapClasses = [
    styles.spinnerWrap,
    styles[`spinnerWrap--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <div className={wrapClasses} role="status" aria-label="Loading">
      <div className={styles.ring}></div>
      <span className="sr-only">Loading...</span>
    </div>
  )

  if (fullScreen) {
    return <div className={styles.overlay}>{content}</div>
  }

  return content
}

export default Loader
