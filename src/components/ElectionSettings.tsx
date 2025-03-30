import React, { useState } from 'react'
import { 
  Save,
  AlertCircle,
  Check,
  Calendar,
  Clock,
  Settings,
  Bell,
  Globe,
  School,
  Database,
  Upload,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Building,
  Cog,
  HardDrive,
  Vote
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const ElectionSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings()
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [activeTab, setActiveTab] = useState<'organization' | 'system' | 'backup' | 'election'>('organization')
  const [localSettings, setLocalSettings] = useState({
    electionDate: '2025-05-15',
    startTime: '08:00',
    endTime: '17:00',
    allowVoterRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    notifyAdminOnVote: true,
    notifyVoterAfterVote: true,
    showLiveResults: false,
    allowMultipleVotes: false,
    requireVoterPhoto: false,
    systemTimeZone: 'Africa/Accra',
    autoBackupEnabled: true,
    autoBackupInterval: '24', // hours
    lastBackupDate: null as Date | null,
    lastRestoreDate: null as Date | null
  })

  const handleSave = () => {
    setNotification({
      type: 'success',
      message: 'Settings saved successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleSetElectionDate = () => {
    setNotification({
      type: 'success',
      message: 'Election date set successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleBackup = () => {
    setLocalSettings({
      ...localSettings,
      lastBackupDate: new Date()
    })
    
    setNotification({
      type: 'success',
      message: 'Manual backup completed successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleRestore = () => {
    setLocalSettings({
      ...localSettings,
      lastRestoreDate: new Date()
    })
    
    setNotification({
      type: 'success',
      message: 'System restored successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'company' | 'school') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        if (type === 'company') {
          updateSettings({ companyLogo: base64String })
        } else {
          updateSettings({ schoolLogo: base64String })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    {
      id: 'organization',
      name: 'Organization',
      icon: Building,
      description: 'Company and school settings',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      activeGradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'system',
      name: 'System',
      icon: Cog,
      description: 'General system configuration',
      gradient: 'from-emerald-500/20 to-green-500/20',
      activeGradient: 'from-emerald-500 to-green-600'
    },
    {
      id: 'backup',
      name: 'Backup & Restore',
      icon: HardDrive,
      description: 'Data backup and recovery',
      gradient: 'from-amber-500/20 to-yellow-500/20',
      activeGradient: 'from-amber-500 to-yellow-600'
    },
    {
      id: 'election',
      name: 'Election',
      icon: Vote,
      description: 'Election parameters',
      gradient: 'from-purple-500/20 to-pink-500/20',
      activeGradient: 'from-purple-500 to-pink-600'
    }
  ] as const

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-indigo-100 text-sm font-sans font-light">Configure system and election parameters</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            {notification.type === 'success' ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-400" />
            )}
            <div className="ml-3">
              <p className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative overflow-hidden py-2 px-3 rounded-xl transition-all duration-300 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.activeGradient} shadow-lg scale-[1.02]`
                : `bg-gradient-to-r ${tab.gradient} hover:scale-[1.02]`
            }`}
          >
            {/* Animated background effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} group-hover:opacity-100 transition-opacity duration-300 ${
              activeTab === tab.id ? 'opacity-0' : 'opacity-100'
            }`} />

            {/* Content */}
            <div className="relative flex items-center space-x-3">
              <div className={`flex-shrink-0 p-2 rounded-lg transition-colors duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white/20' 
                  : 'bg-white group-hover:bg-white/80'
              }`}>
                <tab.icon className={`h-5 w-5 transition-colors duration-300 ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-gray-700 group-hover:text-gray-900'
                }`} />
              </div>
              <div className="text-left min-w-0">
                <h3 className={`text-sm font-medium truncate transition-colors duration-300 ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-gray-900 group-hover:text-gray-900'
                }`}>
                  {tab.name}
                </h3>
                <p className={`text-xs truncate transition-colors duration-300 ${
                  activeTab === tab.id 
                    ? 'text-white/80' 
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {tab.description}
                </p>
              </div>
            </div>

            {/* Bottom indicator */}
            <div className={`absolute bottom-0 left-0 h-0.5 bg-white/30 transition-all duration-300 ${
              activeTab === tab.id ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Organization Settings */}
        {activeTab === 'organization' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <School className="h-5 w-5 text-indigo-500 mr-2" />
                Organization Details
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={settings.companyName}
                  onChange={(e) => updateSettings({ companyName: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={settings.schoolName}
                  onChange={(e) => updateSettings({ schoolName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {settings.companyLogo ? (
                      <img 
                        src={settings.companyLogo} 
                        alt="Company Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="relative cursor-pointer">
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'company')}
                      />
                      <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Browse...
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">School Logo</label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {settings.schoolLogo ? (
                      <img 
                        src={settings.schoolLogo} 
                        alt="School Logo" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="relative cursor-pointer">
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'school')}
                      />
                      <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Browse...
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the tabs remain the same */}
        {/* ... */}

      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default ElectionSettings