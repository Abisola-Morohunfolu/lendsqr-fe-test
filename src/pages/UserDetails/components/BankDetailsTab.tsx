import type { IUser } from '@/types/user.types'
import styles from '../UserDetails.module.scss'

interface BankDetailsTabProps {
  user: IUser
}

const BankDetailsTab: React.FC<BankDetailsTabProps> = ({ user }) => {
  const formatAccountBalance = (balance: string) => {
    const num = parseFloat(balance.replace(/,/g, ''))
    if (isNaN(num)) return balance
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className={styles.contentCard}>
      <section className={styles.block}>
        <h3 className={styles.blockTitle}>Bank Information</h3>
        <div className={`${styles.dataGrid} ${styles.dataGridFourCol}`}>
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>BANK NAME</p>
            <p className={styles.dataValue}>{user.accountBank || 'Not provided'}</p>
          </div>
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>ACCOUNT NUMBER</p>
            <p className={styles.dataValue}>{user.accountNumber || 'Not provided'}</p>
          </div>
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>ACCOUNT BALANCE</p>
            <p className={styles.dataValue}>₦{formatAccountBalance(user.accountBalance)}</p>
          </div>
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>BVN</p>
            <p className={styles.dataValue}>{user.bvn || 'Not provided'}</p>
          </div>
        </div>
      </section>

      <section className={styles.block}>
        <h3 className={styles.blockTitle}>Financial Summary</h3>
        <div className={`${styles.dataGrid} ${styles.dataGridFourCol}`}>
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>MONTHLY INCOME</p>
            <p className={styles.dataValue}>{user.educationAndEmployment.monthlyIncome || 'Not provided'}</p>
          </div>
          <div className={styles.dataField}>
            <p className={styles.dataLabel}>LOAN REPAYMENT</p>
            <p className={styles.dataValue}>₦{user.educationAndEmployment.loanRepayment || '0'}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BankDetailsTab
