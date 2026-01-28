import React, { useState } from 'react'
import { Button } from '@/components/common'
import type { IUserFilters, UserStatus } from '@/types/user.types'
import styles from './FilterPopup.module.scss'

export interface FilterPopupProps {
  onFilter: (filters: IUserFilters) => void
  onReset: () => void
  onClose: () => void
}

const FilterPopup: React.FC<FilterPopupProps> = ({ onFilter, onReset, onClose }) => {
  const [filters, setFilters] = useState<IUserFilters>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({})
    onReset()
  }

  const handleChange = (field: keyof IUserFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined,
    }))
  }

  return (
    <>
      <div className={styles.panelOverlay} onClick={onClose} />
      <div className={styles.filterPanel}>
        <form onSubmit={handleSubmit} className={styles.filterForm}>
          <div className={styles.fieldGroup}>
            <label htmlFor="filter-organization" className={styles.fieldLabel}>
              Organization
            </label>
            <select
              id="filter-organization"
              className={styles.selectField}
              value={filters.organization || ''}
              onChange={(e) => handleChange('organization', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Lendsqr">Lendsqr</option>
              <option value="Irorun">Irorun</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="filter-username" className={styles.fieldLabel}>
              Username
            </label>
            <input
              id="filter-username"
              type="text"
              className={styles.textField}
              placeholder="User"
              value={filters.username || ''}
              onChange={(e) => handleChange('username', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="filter-email" className={styles.fieldLabel}>
              Email
            </label>
            <input
              id="filter-email"
              type="email"
              className={styles.textField}
              placeholder="Email"
              value={filters.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="filter-date" className={styles.fieldLabel}>
              Date
            </label>
            <input
              id="filter-date"
              type="date"
              className={styles.textField}
              value={filters.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="filter-phone" className={styles.fieldLabel}>
              Phone Number
            </label>
            <input
              id="filter-phone"
              type="tel"
              className={styles.textField}
              placeholder="Phone Number"
              value={filters.phoneNumber || ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="filter-status" className={styles.fieldLabel}>
              Status
            </label>
            <select
              id="filter-status"
              className={styles.selectField}
              value={filters.status || ''}
              onChange={(e) => handleChange('status', e.target.value as UserStatus)}
            >
              <option value="">Select</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>

          <div className={styles.actionRow}>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" variant="primary">
              Filter
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default FilterPopup
