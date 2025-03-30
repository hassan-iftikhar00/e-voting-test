import React, { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  X, Check, AlertCircle, Download, RefreshCw,
  FileSpreadsheet, Printer, Columns, Info,
  ClipboardList, ArrowUp, ArrowDown, Calendar, User, Settings
} from 'lucide-react'

// Mock data
const initialLogs = [
  { id: '1', action: 'Admin login', user: 'admin', timestamp: new Date('2025-05-15T08:00:00'), details: 'IP: 192.168.1.1' },
  { id: '2', action: 'Election activated', user: 'admin', timestamp: new Date('2025-05-15T08:05:00'), details: 'Election ID: 1' },
  { id: '3', action: 'Voter VOTER2023 voted', user: 'Kwame Asante', timestamp: new Date('2025-05-15T09:15:22'), details: 'Positions: 3' },
  { id: '4', action: 'Voter VOTER2024 voted', user: 'Jane Smith', timestamp: new Date('2025-05-15T10:30:45'), details: 'Positions: 3' },
  { id: '5', action: 'Voter VOTER2021 voted', user: 'Kofi Owusu', timestamp: new Date('2025-05-15T11:45:10'), details: 'Positions: 3' },
  { id: '6', action: 'Voter VOTER2019 voted', user: 'Yaw Boateng', timestamp: new Date('2025-05-15T08:20:33'), details: 'Positions: 3' },
  { id: '7', action: 'Added new candidate', user: 'admin', timestamp: new Date('2025-05-14T14:30:00'), details: 'Candidate: John Mensah' },
  { id: '8', action: 'Updated election settings', user: 'admin', timestamp: new Date('2025-05-14T15:45:00'), details: 'Changed end date' },
  { id: '9', action: 'Added new voter', user: 'admin', timestamp: new Date('2025-05-14T10:15:00'), details: 'Voter ID: VOTER2026' },
  { id: '10', action: 'Added new position', user: 'admin', timestamp: new Date('2025-05-13T11:30:00'), details: 'Position: Compound Prefect' },
  { id: '11', action: 'System backup', user: 'system', timestamp: new Date('2025-05-13T00:00:00'), details: 'Automatic backup' },
  { id: '12', action: 'Election created', user: 'admin', timestamp: new Date('2025-05-12T09:00:00'), details: 'Election ID: 1' }
]

interface LogEntry {
  id: string
  action: string
  user: string
  timestamp: Date
  details: string
}

const ActivityLogManager: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterUser, setFilterUser] = useState<string>('')
  const [filterAction, setFilterAction] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [sortField, setSortField] = useState<'timestamp' | 'action' | 'user'>('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const columnSelectorRef = useRef<HTMLDivElement>(null)
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState({
    timestamp: true,
    action: true,
    user: true,
    details: true
  })

  // Close column selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
        setShowColumnSelector(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get unique users and actions for filters
  const uniqueUsers = Array.from(new Set(logs.map(log => log.user))).sort()
  const uniqueActions = Array.from(new Set(logs.map(log => log.action))).sort()

  // Filter and sort logs
  const filteredLogs = logs
    .filter(log => 
      (log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
       log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
       log.details.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterUser === '' || log.user === filterUser) &&
      (filterAction === '' || log.action === filterAction) &&
      (startDate === '' || new Date(log.timestamp) >= new Date(startDate)) &&
      (endDate === '' || new Date(log.timestamp) <= new Date(`${endDate}T23:59:59`))
    )
    .sort((a, b) => {
      if (sortField === 'timestamp') {
        return sortDirection === 'asc' 
          ? a.timestamp.getTime() - b.timestamp.getTime() 
          : b.timestamp.getTime() - a.timestamp.getTime()
      } else if (sortField === 'action') {
        return sortDirection === 'asc' 
          ? a.action.localeCompare(b.action) 
          : b.action.localeCompare(a.action)
      } else if (sortField === 'user') {
        return sortDirection === 'asc' 
          ? a.user.localeCompare(b.user) 
          : b.user.localeCompare(a.user)
      }
      return 0
    })

  const handleSort = (field: 'timestamp' | 'action' | 'user') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilterUser('')
    setFilterAction('')
    setStartDate('')
    setEndDate('')
  }

  // Format date and time for display
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date)
  }

  // Format date only for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date)
  }

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print')
      return
    }
    
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        h1 { text-align: center; color: #4338ca; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background-color: #f3f4f6; color: #374151; font-weight: bold; text-align: left; padding: 12px; }
        td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    `
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Activity Log - Peki Senior High School</title>
          ${styles}
        </head>
        <body>
          <h1>Peki Senior High School - Activity Log</h1>
          
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                ${visibleColumns.timestamp ? '<th>Timestamp</th>' : ''}
                ${visibleColumns.action ? '<th>Action</th>' : ''}
                ${visibleColumns.user ? '<th>User</th>' : ''}
                ${visibleColumns.details ? '<th>Details</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${filteredLogs.map((log, index) => `
                <tr>
                  <td>${index + 1}</td>
                  ${visibleColumns.timestamp ? `<td>${formatDateTime(log.timestamp)}</td>` : ''}
                  ${visibleColumns.action ? `<td>${log.action}</td>` : ''}
                  ${visibleColumns.user ? `<td>${log.user}</td>` : ''}
                  ${visibleColumns.details ? `<td>${log.details}</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Printed on ${new Date().toLocaleString()}</p>
            <p>Peki Senior High School - Prefectorial Elections 2025</p>
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  // Handle export to Excel
  const handleExportExcel = () => {
    // Create CSV content
    let csvContent = "S/N,Timestamp,Action,User,Details\n"
    
    filteredLogs.forEach((log, index) => {
      csvContent += `${index + 1},"${formatDateTime(log.timestamp)}","${log.action}","${log.user}","${log.details}"\n`
    })
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `activity_log_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get icon for action type
  const getActionIcon = (action: string) => {
    if (action.includes('login')) return <User className="h-4 w-4 text-blue-500" />
    if (action.includes('voted')) return <Check className="h-4 w-4 text-green-500" />
    if (action.includes('settings')) return <Settings className="h-4 w-4 text-purple-500" />
    if (action.includes('backup')) return <Download className="h-4 w-4 text-yellow-500" />
    return <ClipboardList className="h-4 w-4 text-indigo-500" />
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold">Activity Log</h2>
          <p className="text-indigo-100 text-sm font-sans font-light">Track all system activities and user actions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Log
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        } flex justify-between items-start shadow-sm`}>
          <div className="flex">
            {notification.type === 'success' ? (
              <Check className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            )}
            <p className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {notification.message}
            </p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2 md:ml-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Print log"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              Print
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              title="Export to Excel"
            >
              <FileSpreadsheet className="h-4 w-4 mr-1.5" />
              Export
            </button>
            <div className="relative" ref={columnSelectorRef}>
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                title="Select columns"
              >
                <Columns className="h-4 w-4 mr-1.5" />
                Columns
              </button>
              
              {showColumnSelector && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2">
                    <div className="text-sm font-medium text-gray-700 mb-2 border-b pb-1">Show/Hide Columns</div>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.timestamp}
                          onChange={() => setVisibleColumns({...visibleColumns, timestamp: !visibleColumns.timestamp})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Timestamp</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.action}
                          onChange={() => setVisibleColumns({...visibleColumns, action: !visibleColumns.action})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Action</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.user}
                          onChange={() => setVisibleColumns({...visibleColumns, user: !visibleColumns.user})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">User</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.details}
                          onChange={() => setVisibleColumns({...visibleColumns, details: !visibleColumns.details})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Details</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Advanced filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filterUser" className="block text-xs font-medium text-gray-700 mb-1">User</label>
            <select
              id="filterUser"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            >
              <option value="">All Users</option>
              {uniqueUsers.map((user) => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="filterAction" className="block text-xs font-medium text-gray-700 mb-1">Action</label>
            <select
              id="filterAction"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              id="startDate"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              id="endDate"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        
        {/* Clear filters button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  S/N
                </th>
                {visibleColumns.timestamp && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center">
                      Timestamp
                      {sortField === 'timestamp' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                          <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.action && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('action')}
                  >
                    <div className="flex items-center">
                      Action
                      {sortField === 'action' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                          <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.user && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('user')}
                  >
                    <div className="flex items-center">
                      User
                      {sortField === 'user' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                          <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.details && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredLogs.map((log, index) => (
                <tr key={log.id} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  {visibleColumns.timestamp && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{formatDate(log.timestamp)}</div>
                          <div className="text-xs text-gray-500">{log.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.action && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <span className="ml-2 text-sm text-gray-900">{log.action}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.user && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.user}</div>
                    </td>
                  )}
                  {visibleColumns.details && (
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-500">{log.details}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No log entries found matching your search criteria.
          </div>
        )}
        
        {/* Status bar with table information */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>
              Showing <span className="font-medium text-gray-900">{filteredLogs.length}</span> of <span className="font-medium text-gray-900">{logs.length}</span> log entries
              {(filterUser || filterAction || startDate || endDate) && (
                <span> • Filters applied</span>
              )}
              {searchTerm && (
                <span> • Search: "{searchTerm}"</span>
              )}
            </span>
          </div>
          <div>
            <button
              onClick={handleClearFilters}
              className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityLogManager