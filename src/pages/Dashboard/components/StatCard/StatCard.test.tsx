import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from './StatCard'

describe('StatCard Component', () => {
  it('should render label and value correctly', () => {
    render(<StatCard icon="users" label="USERS" value="100" color="pink" />)
    
    expect(screen.getByText('USERS')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('should render with number value', () => {
    render(<StatCard icon="users" label="USERS" value={150} color="pink" />)
    
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('should render with formatted string value', () => {
    render(<StatCard icon="users" label="USERS" value="1,000" color="pink" />)
    
    expect(screen.getByText('1,000')).toBeInTheDocument()
  })

  it('should render all icon variants', () => {
    const icons: Array<'users' | 'active-users' | 'loans' | 'savings'> = [
      'users',
      'active-users',
      'loans',
      'savings',
    ]

    icons.forEach(icon => {
      const { unmount } = render(
        <StatCard icon={icon} label="TEST" value="0" color="pink" />
      )
      expect(screen.getByText('TEST')).toBeInTheDocument()
      unmount()
    })
  })

  it('should render all color variants', () => {
    const colors: Array<'pink' | 'purple' | 'orange' | 'red'> = [
      'pink',
      'purple',
      'orange',
      'red',
    ]

    colors.forEach(color => {
      const { unmount } = render(
        <StatCard icon="users" label="TEST" value="0" color={color} />
      )
      expect(screen.getByText('TEST')).toBeInTheDocument()
      unmount()
    })
  })

  it('should render icon image', () => {
    const { container } = render(
      <StatCard icon="users" label="USERS" value="100" color="pink" />
    )
    
    const iconImage = container.querySelector('img')
    expect(iconImage).toBeInTheDocument()
    expect(iconImage).toHaveAttribute('alt', '')
  })
})

