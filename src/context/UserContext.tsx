import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface User {
  id: string
  username: string
  role: string
}

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock data
const MOCK_ADMIN = {
  id: '1',
  username: 'admin',
  password: 'admin123', // In a real app, this would be hashed
  role: 'admin'
}

const MOCK_VOTER = {
  id: '2',
  voterId: 'VOTER2025',
  name: 'John Doe',
  hasVoted: false
}

// Add a used voter for demonstration
const USED_VOTER = {
  id: '3',
  voterId: 'VOTER2024',
  name: 'Jane Smith',
  hasVoted: true,
  votedAt: new Date('2025-05-15T10:30:45')
}

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // Mock authentication
      if (username === MOCK_ADMIN.username && password === MOCK_ADMIN.password) {
        const userData = {
          id: MOCK_ADMIN.id,
          username: MOCK_ADMIN.username,
          role: MOCK_ADMIN.role
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', 'mock-token-for-admin')
        return
      }
      throw new Error('Invalid credentials')
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Export mock data for other components
export const getMockVoter = (voterId: string) => {
  if (voterId === MOCK_VOTER.voterId) {
    return {
      ...MOCK_VOTER,
      id: MOCK_VOTER.id
    }
  }
  if (voterId === USED_VOTER.voterId) {
    return {
      ...USED_VOTER,
      id: USED_VOTER.id
    }
  }
  return null
}

export const getMockElection = () => ({
  title: 'Student Council Election 2025',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  isActive: true
})