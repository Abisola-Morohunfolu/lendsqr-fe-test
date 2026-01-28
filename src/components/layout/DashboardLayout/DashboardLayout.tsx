import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/store/auth-context'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import styles from './DashboardLayout.module.scss'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className={styles.appLayout}>
      <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      <div className={styles.contentArea}>
        <Header onMenuToggle={toggleMobileMenu} />
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
