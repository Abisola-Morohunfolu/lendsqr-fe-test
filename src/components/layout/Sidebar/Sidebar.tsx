/**
 * Sidebar Component
 * Main navigation for the dashboard
 * Supports mobile overlay with hamburger menu
 */

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Sidebar.module.scss'
import logoIcon from '@/assets/icons/Lendsqr-logo.svg'
import organizationIcon from '@/assets/icons/sidebar-icons/organization.svg'
import dashboardIcon from '@/assets/icons/sidebar-icons/dashboard.svg'
import usersIcon from '@/assets/icons/sidebar-icons/users.svg'
import guarantorsIcon from '@/assets/icons/sidebar-icons/guarantors.svg'
import loansIcon from '@/assets/icons/sidebar-icons/loans.svg'
import decisionModelsIcon from '@/assets/icons/sidebar-icons/decision-models.svg'
import savingsIcon from '@/assets/icons/sidebar-icons/savings.svg'
import loanRequestsIcon from '@/assets/icons/sidebar-icons/loan-requests.svg'
import whitelistIcon from '@/assets/icons/sidebar-icons/whitelist.svg'
import karmaIcon from '@/assets/icons/sidebar-icons/karma.svg'
import loanProductsIcon from '@/assets/icons/sidebar-icons/loan-products.svg'
import savingsProductsIcon from '@/assets/icons/sidebar-icons/savings-products.svg'
import feesIcon from '@/assets/icons/sidebar-icons/fees.svg'
import transactionsIcon from '@/assets/icons/sidebar-icons/transactions.svg'
import servicesIcon from '@/assets/icons/sidebar-icons/services.svg'
import serviceAccountIcon from '@/assets/icons/sidebar-icons/service-account.svg'
import settlementsIcon from '@/assets/icons/sidebar-icons/settlements.svg'
import reportsIcon from '@/assets/icons/sidebar-icons/reports.svg'
import preferencesIcon from '@/assets/icons/sidebar-icons/preferences.svg'
import feesAndPricingIcon from '@/assets/icons/sidebar-icons/fees-and-pricing.svg'
import auditIcon from '@/assets/icons/sidebar-icons/audit.svg'
import systemMsgsIcon from '@/assets/icons/sidebar-icons/system-msgs.svg'
import logoutIcon from '@/assets/icons/sidebar-icons/logout.svg'
import { useAuth } from '@/store/auth-context'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.navPanel} ${isOpen ? styles.navExpanded : ''}`}>
        <div className={styles.panelContent}>
          <button
            className={styles.dismissBtn}
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className={styles.brandLogo}>
            <img
              src={logoIcon}
              alt="Logo"
              className={styles.brandImg}
            />
          </div>

          <div className={styles.orgSelector}>
            <img src={organizationIcon} alt="" className={styles.orgImg} />
            <span>Switch Organization</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.dropIcon}>
              <path d="M7 10L2 5H12L7 10Z" fill="#213F7D"/>
            </svg>
          </div>

          <NavLink to="/dashboard" className={styles.homeLink}>
            <img src={dashboardIcon} alt="" className={styles.itemIcon} />
            <span>Dashboard</span>
          </NavLink>

          <nav className={styles.menu}>
            <div className={styles.menuGroup}>
              <h3 className={styles.groupLabel}>CUSTOMERS</h3>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`
                }
              >
                <img src={usersIcon} alt="" className={styles.itemIcon} />
                <span>Users</span>
              </NavLink>
              <div className={styles.menuItem}>
                <img src={guarantorsIcon} alt="" className={styles.itemIcon} />
                <span>Guarantors</span>
              </div>
              <div className={styles.menuItem}>
                <img src={loansIcon} alt="" className={styles.itemIcon} />
                <span>Loans</span>
              </div>
              <div className={styles.menuItem}>
                <img src={decisionModelsIcon} alt="" className={styles.itemIcon} />
                <span>Decision Models</span>
              </div>
              <div className={styles.menuItem}>
                <img src={savingsIcon} alt="" className={styles.itemIcon} />
                <span>Savings</span>
              </div>
              <div className={styles.menuItem}>
                <img src={loanRequestsIcon} alt="" className={styles.itemIcon} />
                <span>Loan Requests</span>
              </div>
              <div className={styles.menuItem}>
                <img src={whitelistIcon} alt="" className={styles.itemIcon} />
                <span>Whitelist</span>
              </div>
              <div className={styles.menuItem}>
                <img src={karmaIcon} alt="" className={styles.itemIcon} />
                <span>Karma</span>
              </div>
            </div>

            <div className={styles.menuGroup}>
              <h3 className={styles.groupLabel}>BUSINESSES</h3>
              <div className={styles.menuItem}>
                <img src={organizationIcon} alt="" className={styles.itemIcon} />
                <span>Organization</span>
              </div>
              <div className={styles.menuItem}>
                <img src={loanProductsIcon} alt="" className={styles.itemIcon} />
                <span>Loan Products</span>
              </div>
              <div className={styles.menuItem}>
                <img src={savingsProductsIcon} alt="" className={styles.itemIcon} />
                <span>Savings Products</span>
              </div>
              <div className={styles.menuItem}>
                <img src={feesIcon} alt="" className={styles.itemIcon} />
                <span>Fees and Charges</span>
              </div>
              <div className={styles.menuItem}>
                <img src={transactionsIcon} alt="" className={styles.itemIcon} />
                <span>Transactions</span>
              </div>
              <div className={styles.menuItem}>
                <img src={servicesIcon} alt="" className={styles.itemIcon} />
                <span>Services</span>
              </div>
              <div className={styles.menuItem}>
                <img src={serviceAccountIcon} alt="" className={styles.itemIcon} />
                <span>Service Account</span>
              </div>
              <div className={styles.menuItem}>
                <img src={settlementsIcon} alt="" className={styles.itemIcon} />
                <span>Settlements</span>
              </div>
              <div className={styles.menuItem}>
                <img src={reportsIcon} alt="" className={styles.itemIcon} />
                <span>Reports</span>
              </div>
            </div>

            <div className={styles.menuGroup}>
              <h3 className={styles.groupLabel}>SETTINGS</h3>
              <div className={styles.menuItem}>
                <img src={preferencesIcon} alt="" className={styles.itemIcon} />
                <span>Preferences</span>
              </div>
              <div className={styles.menuItem}>
                <img src={feesAndPricingIcon} alt="" className={styles.itemIcon} />
                <span>Fees and Pricing</span>
              </div>
              <div className={styles.menuItem}>
                <img src={auditIcon} alt="" className={styles.itemIcon} />
                <span>Audit Logs</span>
              </div>
              <div className={styles.menuItem}>
                <img src={systemMsgsIcon} alt="" className={styles.itemIcon} />
                <span>Systems Messages</span>
              </div>
            </div>
          </nav>

          <div className={styles.panelFooter}>
            <button
              type="button"
              className={styles.signOutBtn}
              onClick={handleLogout}
              aria-label="Logout"
            >
              <img src={logoutIcon} alt="" className={styles.itemIcon} />
              <span>Logout</span>
            </button>
            <div className={styles.versionTag}>v1.2.0</div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
