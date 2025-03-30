import React, { useState, useEffect, useRef } from 'react'
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
  Vote,
  Play,
  RotateCw,
  Trash2
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

// Mock data for previous elections
const mockPreviousElections = [
  {
    id: '1',
    title: 'Student Council Election 2024',
    date: '15-May-2024',
    startTime: '08:00:00',
    endTime: '17:00:00',
    hasData: true
  },
  {
    id: '2',
    title: 'Student Council Election 2023',
    date: '15-May-2023',
    startTime: '08:00:00',
    endTime: '17:00:00',
    hasData: true
  }
]

const ElectionSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings()
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [activeTab, setActiveTab] = useState<'organization' | 'backup' | 'election'>('organization')
  const [previousElections, setPreviousElections] = useState(mockPreviousElections)
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

  const handleAddElection = () => {
    // Convert 24h time to 12h format
    const formatTime = (time: string) => {
      const [hours, minutes, seconds] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    };

    const newElection = {
      id: (previousElections.length + 1).toString(),
      title: settings.electionTitle,
      date: settings.electionDate,
      startTime: formatTime(settings.electionStartTime),
      endTime: formatTime(settings.electionEndTime),
      hasData: false
    };

    setPreviousElections(prev => [newElection, ...prev]);
    updateSettings({
      electionDate: newElection.date,
      electionStartTime: settings.electionStartTime,
      electionEndTime: settings.electionEndTime
    });
    
    setNotification({
      type: 'success',
      message: 'Election added successfully'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'company' | 'school') => {
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

  const handleReUpload = (id: string) => {
    setPreviousElections(prev => 
      prev.map(election => 
        election.id === id 
          ? { ...election, hasData: true }
          : election
      )
    )
    
    setNotification({
      type: 'success',
      message: 'Election data re-uploaded successfully'
    })
    
    setTimeout(() => setNotification(null), 3000)
  }

  const handleLoad = (id: string) => {
    setPreviousElections(prev => 
      prev.map(election => 
        election.id === id 
          ? { ...election, hasData: true }
          : election
      )
    )
    
    setNotification({
      type: 'success',
      message: 'Election loaded successfully'
    })
    
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDelete = (id: string) => {
    setPreviousElections(prev => prev.filter(election => election.id !== id))
    
    setNotification({
      type: 'success',
      message: 'Election deleted successfully'
    })
    
    setTimeout(() => setNotification(null), 3000)
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Election Settings */}
        {activeTab === 'election' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Vote className="h-5 w-5 text-indigo-500 mr-2" />
                Election Configuration
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Election Title</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={settings.electionTitle}
                  onChange={(e) => updateSettings({ electionTitle: e.target.value })}
                  placeholder="Enter election title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Election Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={settings.electionDate}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        const formattedDate = date.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }).replace(/ /g, '-');
                        updateSettings({ electionDate: formattedDate });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      step="1"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={settings.electionStartTime}
                      onChange={(e) => updateSettings({ electionStartTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        step="1"
                        className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={settings.electionEndTime}
                        onChange={(e) => updateSettings({ electionEndTime: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={handleAddElection}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Current and Previous Elections */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current and Previous Elections</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Election Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previousElections.map((election) => (
                        <tr key={election.id} className={election.date === settings.electionDate ? 'bg-indigo-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {election.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {election.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {election.startTime} - {election.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              election.date === settings.electionDate 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {election.date === settings.electionDate ? 'Current' : 'Past'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {election.hasData ? (
                                <button
                                  onClick={() => handleReUpload(election.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Re-upload election data"
                                >
                                  <Upload className="h-5 w-5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleLoad(election.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Load election"
                                >
                                  <Play className="h-5 w-5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(election.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete election"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backup & Restore tab content */}
        {activeTab === 'backup' && (
          <div className="p-6 space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Database className="h-5 w-5 text-indigo-500 mr-2" />
                Backup & Recovery
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Auto Backup</h4>
                  <p className="text-sm text-gray-500">Automatically backup system data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={localSettings.autoBackupEnabled}
                    onChange={(e) => setLocalSettings({...localSettings, autoBackupEnabled: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Interval</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={localSettings.autoBackupInterval}
                    onChange={(e) => setLocalSettings({...localSettings, autoBackupInterval: e.target.value})}
                  >
                    <option value="6">Every 6 hours</option>
                    <option value="12">Every 12 hours</option>
                    <option value="24">Every 24 hours</option>
                    <option value="48">Every 48 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Backup</label>
                  <div className="text-sm text-gray-500">
                    {localSettings.lastBackupDate 
                      ? localSettings.lastBackupDate.toLocaleString() 
                      : 'No backup yet'}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleBackup}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Manual Backup
                </button>

                <button
                  onClick={handleRestore}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Restore System
                </button>
              </div>

              {localSettings.lastRestoreDate && (
                <div className="text-sm text-gray-500">
                  Last restored: {localSettings.lastRestoreDate.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
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