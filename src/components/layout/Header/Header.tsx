import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/store/auth-context'
import styles from './Header.module.scss'
import avatarIcon from '@/assets/icons/avatar.png'
import notificationBellIcon from '@/assets/icons/notification-bell.svg'

interface HeaderProps {
  onMenuToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { userEmail, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', searchQuery)
  }

  const handleLogout = () => {
    setShowDropdown(false)
    logout()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

          <div className={styles.accountWrapper} ref={dropdownRef}>
            <button
              className={styles.accountInfo}
              onClick={() => setShowDropdown(!showDropdown)}
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <div className={styles.profilePic}>
                <img
                  src={avatarIcon}
                  alt={userEmail || 'User'}
                  className={styles.profileImg}
                />
              </div>
              <span className={styles.displayName}>
                Adedeji
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`${styles.caret} ${showDropdown ? styles.caretOpen : ''}`}
              >
                <path d="M6 8L2 4H10L6 8Z" fill="#213F7D"/>
              </svg>
            </button>

            {showDropdown && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownEmail}>{userEmail}</span>
                </div>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.6667 11.3333L14 8L10.6667 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
