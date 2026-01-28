import React from 'react'
import styles from './Pagination.module.scss'

export interface PaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className={styles.pager}>
      <div className={styles.summary}>
        <span>Showing</span>
        <select
          className={styles.sizeSelect}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>
          out of {totalItems}
        </span>
      </div>

      <div className={styles.nav}>
        <button
          className={styles.arrowBtn}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8 11L5 7L8 3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        <div className={styles.pages}>
          {getPageNumbers().map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                className={`${styles.pageNum} ${
                  page === currentPage ? styles.pageNumCurrent : ''
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className={styles.dots}>
                {page}
              </span>
            )
          )}
        </div>

        <button
          className={styles.arrowBtn}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 3L9 7L6 11" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Pagination
