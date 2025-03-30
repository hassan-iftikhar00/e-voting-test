import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface Settings {
  companyName: string
  companyLogo: string | null
  schoolName: string
  schoolLogo: string | null
  electionTitle: string
  electionDate: string
  electionStartTime: string
  electionEndTime: string
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Load settings from localStorage
const loadSettings = (): Settings => {
  const savedSettings = localStorage.getItem('settings')
  if (savedSettings) {
    return JSON.parse(savedSettings)
  }
  return {
    companyName: 'Smart E-Voting',
    companyLogo: null,
    schoolName: 'Peki Senior High School',
    schoolLogo: null,
    electionTitle: 'Student Council Election 2025',
    electionDate: '2025-05-15',
    electionStartTime: '08:00:00',
    electionEndTime: '17:00:00'
  }
}

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}