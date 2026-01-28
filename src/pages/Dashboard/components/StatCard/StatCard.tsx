import React from 'react'
import styles from './StatCard.module.scss'
import usersPinkIcon from '@/assets/icons/users-pink.svg'
import activeUsersIcon from '@/assets/icons/active-users.svg'
import usersWithLoansIcon from '@/assets/icons/users-with-loans.svg'
import usersWithSavingsIcon from '@/assets/icons/users-with-savings.svg'

export interface StatCardProps {
  icon: 'users' | 'active-users' | 'loans' | 'savings'
  label: string
  value: string | number
  color: 'pink' | 'purple' | 'orange' | 'red'
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const getIcon = () => {
    switch (icon) {
      case 'users':
        return usersPinkIcon
      case 'active-users':
        return activeUsersIcon
      case 'loans':
        return usersWithLoansIcon
      case 'savings':
        return usersWithSavingsIcon
      default:
        return usersPinkIcon
    }
  }

  return (
    <div className={styles.metricCard}>
      <div className={`${styles.iconBox} ${styles[`iconBox--${color}`]}`}>
        <img src={getIcon()} alt="" className={styles.iconImg} />
      </div>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{value}</p>
    </div>
  )
}

export default StatCard
