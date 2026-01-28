import React, { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const btnClasses = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    fullWidth && styles['btn--fullWidth'],
    loading && styles['btn--busy'],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={btnClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className={styles.loader} />
          <span className={styles.busyText}>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
