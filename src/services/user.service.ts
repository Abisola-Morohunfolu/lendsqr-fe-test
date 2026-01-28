import type { IUser } from '@/types/user.types'
import {formatDate} from "@/utils/formatters.ts";

const DATA_URL = '/users.json'

function formatNumber(value: unknown): string {
  const num = Number(value)
  if (isNaN(num)) return '0'
  return num.toLocaleString('en-US')
}

function normalizeUser(u: any): IUser {
  return {
    id: String(u?.id ?? ''),
    organization: String(u?.organization ?? ''),
    username: String(u?.username ?? ''),
    email: String(u?.email ?? ''),
    phoneNumber: String(u?.phoneNumber ?? ''),
    createdAt: formatDate(String(u?.createdAt ?? '')),
    status: String(u?.status ?? 'Active'),
    avatar: String(u?.avatar ?? ''),
    fullName: String(u?.fullName ?? ''),
    userTier: (Number(u?.userTier) || 1) as 1 | 2 | 3,
    accountBalance:
      typeof u?.accountBalance === 'number'
        ? u.accountBalance.toFixed(2)
        : String(u?.accountBalance ?? '0'),
    accountBank: String(u?.accountBank ?? ''),
    accountNumber: String(u?.accountNumber ?? ''),
    bvn: String(u?.bvn ?? ''),
    personalInfo: {
      gender: String(u?.personalInfo?.gender ?? ''),
      maritalStatus: String(u?.personalInfo?.maritalStatus ?? ''),
      children: String(u?.personalInfo?.children ?? 'None'),
      typeOfResidence: String(u?.personalInfo?.typeOfResidence ?? ''),
      email: String(u?.personalInfo?.email ?? ''),
      facebook: String(u?.personalInfo?.facebook ?? ''),
      twitter: String(u?.personalInfo?.twitter ?? ''),
      instagram: String(u?.personalInfo?.instagram ?? ''),
    },
    educationAndEmployment: {
      levelOfEducation: String(u?.educationAndEmployment?.levelOfEducation ?? ''),
      employmentStatus: String(u?.educationAndEmployment?.employmentStatus ?? ''),
      sectorOfEmployment: String(u?.educationAndEmployment?.sectorOfEmployment ?? ''),
      durationOfEmployment: String(u?.educationAndEmployment?.durationOfEmployment ?? ''),
      officeEmail: String(u?.educationAndEmployment?.officeEmail ?? ''),
      monthlyIncome: String(u?.educationAndEmployment?.monthlyIncome ?? ''),
      loanRepayment: formatNumber(u?.educationAndEmployment?.loanRepayment),
    },
    guarantors: Array.isArray(u?.guarantors)
      ? u.guarantors.map((g: any) => ({
          fullName: String(g?.fullName ?? ''),
          phoneNumber: String(g?.phoneNumber ?? ''),
          email: g?.email ? String(g.email) : undefined,
          relationship: String(g?.relationship ?? ''),
        }))
      : [],
  } as IUser
}

export async function getUsers(): Promise<IUser[]> {
  const response = await fetch(DATA_URL)

  if (!response.ok) {
    throw new Error('Unable to fetch user data')
  }

  const data = await response.json()
  const list = Array.isArray(data) ? data : data?.users || []

  return list.map(normalizeUser)
}

export async function getUserById(userId: string): Promise<IUser | null> {
  const users = await getUsers()
  return users.find((u) => u.id === userId) || null
}

export function paginateUsers(users: IUser[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    users: users.slice(startIndex, endIndex),
    pagination: {
      page,
      pageSize,
      total: users.length,
      totalPages: Math.ceil(users.length / pageSize),
      hasNext: endIndex < users.length,
      hasPrev: page > 1,
    },
  }
}
