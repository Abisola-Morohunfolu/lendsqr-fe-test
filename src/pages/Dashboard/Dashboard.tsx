import { DashboardLayout } from '@/components/layout'
import { Loader } from '@/components/common'
import { useDashboard } from '@/hooks/useDashboard.ts'
import MetricsRow from './components/MetricsRow'
import UsersTable from './components/UsersTable'
import FilterPopup from './components/FilterPopup'
import Pagination from './components/Pagination'
import styles from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  const {
    users,
    stats,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalItems,
    setCurrentPage,
    handlePageSizeChange,
    showFilterPopup,
    toggleFilterPopup,
    closeFilterPopup,
    handleFilterSubmit,
    handleResetFilters,
    handleUserClick,
    handleBlacklistUser,
    handleActivateUser,
  } = useDashboard()

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className={styles.spinnerWrap}>
          <Loader size="large" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className={styles.errorWrap}>
          <p className={styles.errorText}>
            Failed to load users. Please try again later.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className={styles.usersPage}>
        <h1 className={styles.heading}>Users</h1>

        <MetricsRow stats={stats} />

        <div className={styles.dataCard}>
          <UsersTable
            users={users}
            onUserClick={handleUserClick}
            onFilterClick={toggleFilterPopup}
            onBlacklistUser={handleBlacklistUser}
            onActivateUser={handleActivateUser}
          />

          {showFilterPopup && (
            <FilterPopup
              onFilter={handleFilterSubmit}
              onReset={handleResetFilters}
              onClose={closeFilterPopup}
            />
          )}

          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
