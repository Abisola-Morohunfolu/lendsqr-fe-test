import { useState, useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getUsers, paginateUsers } from '@/services/user.service.ts'
import { userStatusService } from '@/services/user-status.service.ts'
import type { IUserFilters, UserStatus } from '@/types/user.types.ts'

export function useDashboard() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState<IUserFilters>({})
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [statusVersion, setStatusVersion] = useState(0)

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  // Apply status overrides from session storage
  const usersWithOverrides = useMemo(() => {
    const overrides = userStatusService.getOverrides()
    return users.map(user => {
      const override = overrides[user.id]
      return override ? { ...user, status: override } : user
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, statusVersion])

  const stats = useMemo(() => ({
    totalUsers: usersWithOverrides.length,
    activeUsers: usersWithOverrides.filter(u => u.status === 'Active').length,
    usersWithLoans: usersWithOverrides.filter(u => u.educationAndEmployment.loanRepayment !== '0').length,
    usersWithSavings: usersWithOverrides.filter(u => parseFloat(u.accountBalance) > 0).length,
  }), [usersWithOverrides])

  const filteredUsers = useMemo(() => {
    if (Object.keys(filters).length === 0) return usersWithOverrides

    return usersWithOverrides.filter(user => {
      if (filters.organization && !user.organization.toLowerCase().includes(filters.organization.toLowerCase())) {
        return false
      }
      if (filters.username && !user.username.toLowerCase().includes(filters.username.toLowerCase())) {
        return false
      }
      if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false
      }
      if (filters.phoneNumber && !user.phoneNumber.includes(filters.phoneNumber)) {
        return false
      }
      if (filters.status && user.status !== filters.status) {
        return false
      }
      if (filters.date) {
        const userDate = user.dateJoined.split('T')[0]
        if (userDate !== filters.date) {
          return false
        }
      }
      return true
    })
  }, [usersWithOverrides, filters])

  const paginatedData = useMemo(() => {
    return paginateUsers(filteredUsers, currentPage, pageSize)
  }, [filteredUsers, currentPage, pageSize])

  const handleFilterSubmit = useCallback((newFilters: IUserFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setShowFilterPopup(false)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
    setShowFilterPopup(false)
  }, [])

  const handleUserClick = useCallback((userId: string) => {
    navigate(`/users/${userId}`)
  }, [navigate])

  const handleStatusChange = useCallback((userId: string, status: UserStatus) => {
    userStatusService.setStatus(userId, status)
    setStatusVersion(v => v + 1)
  }, [])

  const handleBlacklistUser = useCallback((userId: string) => {
    handleStatusChange(userId, 'Blacklisted')
  }, [handleStatusChange])

  const handleActivateUser = useCallback((userId: string) => {
    handleStatusChange(userId, 'Active')
  }, [handleStatusChange])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  const toggleFilterPopup = useCallback(() => {
    setShowFilterPopup(prev => !prev)
  }, [])

  const closeFilterPopup = useCallback(() => {
    setShowFilterPopup(false)
  }, [])

  return {
    // Data
    users: paginatedData?.users ?? [],
    stats,
    filteredUsers,
    isLoading,
    error,

    // Pagination
    currentPage,
    pageSize,
    totalItems: filteredUsers.length,
    setCurrentPage,
    handlePageSizeChange,

    // Filters
    showFilterPopup,
    toggleFilterPopup,
    closeFilterPopup,
    handleFilterSubmit,
    handleResetFilters,

    // Navigation
    handleUserClick,

    // Status actions
    handleBlacklistUser,
    handleActivateUser,
  }
}
