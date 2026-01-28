import StatCard from '../StatCard'
import styles from './MetricsRow.module.scss'

interface Stats {
  totalUsers: number
  activeUsers: number
  usersWithLoans: number
  usersWithSavings: number
}

interface MetricsRowProps {
  stats: Stats
}

const METRICS_CONFIG = [
  { icon: 'users', label: 'USERS', key: 'totalUsers', color: 'pink' },
  { icon: 'active-users', label: 'ACTIVE USERS', key: 'activeUsers', color: 'purple' },
  { icon: 'loans', label: 'USERS WITH LOANS', key: 'usersWithLoans', color: 'orange' },
  { icon: 'savings', label: 'USERS WITH SAVINGS', key: 'usersWithSavings', color: 'red' },
] as const

const MetricsRow: React.FC<MetricsRowProps> = ({ stats }) => (
  <div className={styles.metricsRow}>
    {METRICS_CONFIG.map((metric) => (
      <StatCard
        key={metric.label}
        icon={metric.icon}
        label={metric.label}
        value={stats[metric.key].toLocaleString()}
        color={metric.color}
      />
    ))}
  </div>
)

export default MetricsRow
