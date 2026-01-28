import React, { useState } from 'react'
import { useAuth } from '@/store/auth-context'
import styles from './Header.module.scss'
import avatarIcon from '@/assets/icons/avatar.png'
import notificationBellIcon from '@/assets/icons/notification-bell.svg'

interface HeaderProps {
  onMenuToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { userEmail } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', searchQuery)
  }

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarContent}>
        <button
          className={styles.menuToggle}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span className={styles.menuBar}></span>
        </button>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search for anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchField}
          />
          <button type="submit" className={styles.searchSubmit} aria-label="Search">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="2"/>
              <path d="M9.5 9.5L12.5 12.5" stroke="white" strokeWidth="2"/>
            </svg>
          </button>
        </form>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.mobileSearch}
            onClick={(e) => {
              e.preventDefault()
              handleSearch(e as any)
            }}
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>

          <a href="#" className={styles.helpLink}>
            Docs
          </a>

          <button className={styles.alertBtn} aria-label="Notifications">
            <img src={notificationBellIcon} alt="" className={styles.alertIcon} />
            <span className={styles.alertCount}>3</span>
          </button>

          <div className={styles.accountInfo}>
            <div className={styles.profilePic}>
              <img
                src={avatarIcon}
                alt={userEmail || 'User'}
                className={styles.profileImg}
              />
            </div>
            <span className={styles.displayName}>Adedeji</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.caret}>
              <path d="M6 8L2 4H10L6 8Z" fill="#213F7D"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
