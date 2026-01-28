import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DashboardLayout } from '@/components/layout'
import { Button, Loader, Tabs, type Tab, StarRating } from '@/components/common'
import { getUserById } from '@/services/user.service'
import { userStatusService } from '@/services/user-status.service'
import type { UserStatus } from '@/types/user.types'
import styles from './UserDetails.module.scss'
import userPlaceholderIcon from '@/assets/icons/avatar-placeholder.svg'
import backArrowIcon from '@/assets/icons/back-arrow.svg'
import GeneralDetailsTab from './components/GeneralDetailsTab.tsx'
import BankDetailsTab from './components/BankDetailsTab.tsx'

enum TabType {
  General = 'general',
  Documents = 'documents',
  Bank = 'bank',
  Loans = 'loans',
  Savings = 'savings',
  App = 'app',
}

const USER_DETAILS_TABS: readonly Tab<TabType>[] = [
  { id: TabType.General, label: 'General Details' },
  { id: TabType.Documents, label: 'Documents' },
  { id: TabType.Bank, label: 'Bank Details' },
  { id: TabType.Loans, label: 'Loans' },
  { id: TabType.Savings, label: 'Savings' },
  { id: TabType.App, label: 'App and System' },
]

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>(TabType.General)
  const [avatarError, setAvatarError] = useState(false)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)

  const {
    data: user,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  // Load status override from session storage
  useEffect(() => {
    if (userId) {
      const storedStatus = userStatusService.getStatus(userId)
      if (storedStatus) {
        setUserStatus(storedStatus)
      }
    }
  }, [userId])

  // Sync local status with fetched user status
  const currentStatus = userStatus ?? user?.status ?? 'Active'

  const handleBlacklistUser = () => {
    if (!user) return
    setUserStatus('Blacklisted')
    userStatusService.setStatus(user.id, 'Blacklisted')
  }

  const handleActivateUser = () => {
    if (!user) return
    setUserStatus('Active')
    userStatusService.setStatus(user.id, 'Active')
  }

  const getAvatarSrc = () => {
    if (avatarError || !user?.avatar) return userPlaceholderIcon
    return user.avatar
  }

  const error = !userId
    ? 'User ID not provided'
    : queryError
      ? 'Failed to load user details'
      : !user && !loading
        ? 'User not found'
        : null

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles.spinnerBox}>
          <Loader size="large" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className={styles.errorBox}>
          <p className={styles.errorMsg}>{error || 'User not found'}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Users</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className={styles.profilePage}>
        <button className={styles.returnBtn} onClick={() => navigate('/dashboard')}>
          <img src={backArrowIcon} alt="" className={styles.returnIcon} />
          <span>Back to Users</span>
        </button>

        <div className={styles.headerRow}>
          <h1 className={styles.title}>User Details</h1>
          <div className={styles.btnGroup}>
            <Button
              variant="danger"
              onClick={handleBlacklistUser}
              disabled={currentStatus === 'Blacklisted'}
            >
              {currentStatus === 'Blacklisted' ? 'BLACKLISTED' : 'BLACKLIST USER'}
            </Button>
            <Button
              variant="primary"
              onClick={handleActivateUser}
              disabled={currentStatus === 'Active'}
            >
              {currentStatus === 'Active' ? 'ACTIVE' : 'ACTIVATE USER'}
            </Button>
          </div>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.profileTop}>
            <div className={styles.userBasic}>
              <div className={styles.photo}>
                <img
                  src={getAvatarSrc()}
                  alt={user.fullName}
                  onError={() => setAvatarError(true)}
                />
              </div>
              <div className={styles.userMeta}>
                <h2 className={styles.fullName}>{user.fullName}</h2>
                <p className={styles.accountId}>{user.id}</p>
              </div>
            </div>

            <div className={styles.tierSection}>
              <p className={styles.tierText}>User's Tier</p>
              <StarRating rating={user.userTier} />
            </div>

            <div className={styles.balanceSection}>
              <h3 className={styles.balance}>₦{parseFloat(user.accountBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <p className={styles.bankInfo}>
                {user.accountNumber}/{user.accountBank}
              </p>
            </div>
          </div>

          <Tabs
            tabs={USER_DETAILS_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {activeTab === TabType.General && <GeneralDetailsTab user={user} />}
        {activeTab === TabType.Bank && <BankDetailsTab user={user} />}

        {activeTab !== TabType.General && activeTab !== TabType.Bank && (
          <div className={styles.contentCard}>
            <p className={styles.emptyText}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} coming soon.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default UserDetails
