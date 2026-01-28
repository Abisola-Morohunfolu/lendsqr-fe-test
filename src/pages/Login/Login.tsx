import React, { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/store/auth-context'
import { Button, Input } from '@/components/common'
import styles from './Login.module.scss'
import logoIcon from '@/assets/icons/Lendsqr-logo.svg'
import illustrationIcon from '@/assets/icons/login-illustration.svg'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>
type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const validateForm = (): boolean => {
    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      const fieldErrors: LoginFormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })
      setErrors(fieldErrors)
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const success = await login(email, password)

      if (success) {
        navigate('/dashboard')
      } else {
        setErrors({ password: 'Invalid credentials' })
      }
    } catch (error) {
      setErrors({ password: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.brandPane}>
        <div className={styles.brandWrap}>
          <img
            src={logoIcon}
            alt="Logo"
            className={styles.brandIcon}
          />
        </div>

        <div className={styles.heroArea}>
          <img
            src={illustrationIcon}
            alt="Illustration"
            className={styles.heroImg}
          />
        </div>
      </div>

      <div className={styles.formPane}>
        <div className={styles.formWrap}>
          <div className={styles.mobileBrand}>
            <img
              src={logoIcon}
              alt="Logo"
              className={styles.brandIcon}
            />
          </div>

          <div className={styles.headerSection}>
            <h1 className={styles.mainTitle}>Welcome!</h1>
            <p className={styles.tagline}>Enter details to login.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              fullWidth
              autoComplete="email"
              aria-required="true"
            />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              fullWidth
              showPasswordToggle
              autoComplete="current-password"
              aria-required="true"
            />

            <a href="#" className={styles.resetLink}>
              FORGOT PASSWORD?
            </a>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              LOG IN
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
