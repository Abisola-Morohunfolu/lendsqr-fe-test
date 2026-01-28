import React, { InputHTMLAttributes, useState } from 'react'
import styles from './Input.module.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
  showPasswordToggle?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordType = type === 'password' || showPasswordToggle
  const inputType = isPasswordType && showPassword ? 'text' : type

  const fieldClasses = [
    styles.field,
    error && styles['field--invalid'],
    fullWidth && styles['field--block'],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.fieldWrap}>
      {label && (
        <label className={styles.fieldLabel} htmlFor={props.id || props.name}>
          {label}
        </label>
      )}

      <div className={styles.fieldBox}>
        <input
          type={inputType}
          className={fieldClasses}
          aria-invalid={!!error}
          aria-describedby={error && props.id ? `${props.id}-error` : undefined}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            className={styles.visibilityToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? 'HIDE' : 'SHOW'}
          </button>
        )}
      </div>

      {error && (
        <span
          className={styles.fieldError}
          id={props.id ? `${props.id}-error` : undefined}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
