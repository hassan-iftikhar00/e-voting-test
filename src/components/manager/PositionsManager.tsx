import React, { useState, useEffect, useRef } from 'react'
import { 
  Plus, Edit, Trash2, Search, 
  X, Check, AlertCircle, Download, RefreshCw,
  FileSpreadsheet, Printer, Columns, Info,
  Briefcase, ArrowUp, ArrowDown
} from 'lucide-react'

// Mock data
const initialPositions = [
  { id: '1', name: 'Senior Prefect', description: 'Lead student representative', order: 1, active: true },
  { id: '2', name: 'Dining Hall Prefect', description: 'Oversees dining hall activities', order: 2, active: true },
  { id: '3', name: 'Sports Prefect', description: 'Coordinates sports activities', order: 3, active: true },
  { id: '4', name: 'Library Prefect', description: 'Manages library resources', order: 4, active: true },
  { id: '5', name: 'Entertainment Prefect', description: 'Organizes entertainment events', order: 5, active: true },
  { id: '6', name: 'Health Prefect', description: 'Promotes health and wellness', order: 6, active: false }
]

interface Position {
  id: string
  name: string
  description: string
  order: number
  active: boolean
}

const PositionsManager: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>(initialPositions)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [sortField, setSortField] = useState<'name' | 'order'>('order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const columnSelectorRef = useRef<HTMLDivElement>(null)
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    description: true,
    order: true,
    status: true,
    actions: true
  })
  
  // Form state
  const [newPosition, setNewPosition] = useState({
    name: '',
    description: '',
    order: positions.length + 1,
    active: true
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

  // Filter and sort positions
  const filteredPositions = positions
    .filter(position => 
      position.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterActive === null || position.active === filterActive)
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name)
      } else if (sortField === 'order') {
        return sortDirection === 'asc' 
          ? a.order - b.order 
          : b.order - a.order
      }
      return 0
    })

  const handleSort = (field: 'name' | 'order') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleAddPosition = () => {
    if (!newPosition.name) {
      setNotification({
        type: 'error',
        message: 'Position name is required'
      })
      return
    }

    const newId = (Math.max(...positions.map(p => parseInt(p.id))) + 1).toString()
    
    setPositions([
      ...positions,
      {
        id: newId,
        ...newPosition
      }
    ])
    
    setNewPosition({
      name: '',
      description: '',
      order: positions.length + 2,
      active: true
    })
    
    setShowAddForm(false)
    setNotification({
      type: 'success',
      message: 'Position added successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleUpdatePosition = () => {
    if (!editingPosition) return
    
    if (!editingPosition.name) {
      setNotification({
        type: 'error',
        message: 'Position name is required'
      })
      return
    }
    
    setPositions(positions.map(position => 
      position.id === editingPosition.id ? editingPosition : position
    ))
    
    setEditingPosition(null)
    setNotification({
      type: 'success',
      message: 'Position updated successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleDeletePosition = (id: string) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      setPositions(positions.filter(position => position.id !== id))
      setNotification({
        type: 'success',
        message: 'Position deleted successfully'
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleMovePosition = (id: string, direction: 'up' | 'down') => {
    const positionIndex = positions.findIndex(p => p.id === id)
    if (
      (direction === 'up' && positionIndex === 0) || 
      (direction === 'down' && positionIndex === positions.length - 1)
    ) {
      return
    }
    
    const newPositions = [...positions]
    const targetIndex = direction === 'up' ? positionIndex - 1 : positionIndex + 1
    
    // Swap order values
    const tempOrder = newPositions[positionIndex].order
    newPositions[positionIndex].order = newPositions[targetIndex].order
    newPositions[targetIndex].order = tempOrder
    
    // Sort by order
    newPositions.sort((a, b) => a.order - b.order)
    
    setPositions(newPositions)
    setNotification({
      type: 'success',
      message: `Position moved ${direction}`
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleToggleActive = (id: string) => {
    setPositions(positions.map(position => 
      position.id === id ? { ...position, active: !position.active } : position
    ))
    
    setNotification({
      type: 'success',
      message: 'Position status updated'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
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
        .status-active { color: #047857; font-weight: bold; }
        .status-inactive { color: #b91c1c; font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    `
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Positions List - Peki Senior High School</title>
          ${styles}
        </head>
        <body>
          <h1>Peki Senior High School - Positions List</h1>
          
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                ${visibleColumns.order ? '<th>Order</th>' : ''}
                ${visibleColumns.name ? '<th>Position Name</th>' : ''}
                ${visibleColumns.description ? '<th>Description</th>' : ''}
                ${visibleColumns.status ? '<th>Status</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${filteredPositions.map((position, index) => `
                <tr>
                  <td>${index + 1}</td>
                  ${visibleColumns.order ? `<td>${position.order}</td>` : ''}
                  ${visibleColumns.name ? `<td>${position.name}</td>` : ''}
                  ${visibleColumns.description ? `<td>${position.description}</td>` : ''}
                  ${visibleColumns.status ? `<td class="${position.active ? 'status-active' : 'status-inactive'}">${position.active ? 'Active' : 'Inactive'}</td>` : ''}
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
    let csvContent = "S/N,Order,Position Name,Description,Status\n"
    
    filteredPositions.forEach((position, index) => {
      csvContent += `${index + 1},${position.order},"${position.name}","${position.description}","${position.active ? 'Active' : 'Inactive'}"\n`
    })
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `positions_list_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Title and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold">Position Management</h2>
          <p className="text-indigo-100 text-sm font-sans font-light">Manage election positions and their order</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingPosition(null)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Position
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

      {/* Add/Edit Form */}
      {(showAddForm || editingPosition) && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center">
            {editingPosition ? (
              <>
                <Edit className="h-5 w-5 text-indigo-500 mr-2" />
                Edit Position
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-indigo-500 mr-2" />
                Add New Position
              </>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingPosition ? editingPosition.name : newPosition.name}
                onChange={(e) => {
                  if (editingPosition) {
                    setEditingPosition({...editingPosition, name: e.target.value})
                  } else {
                    setNewPosition({...newPosition, name: e.target.value})
                  }
                }}
                placeholder="Enter position name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingPosition ? editingPosition.order : newPosition.order}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1
                  if (editingPosition) {
                    setEditingPosition({...editingPosition, order: value})
                  } else {
                    setNewPosition({...newPosition, order: value})
                  }
                }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingPosition ? editingPosition.description : newPosition.description}
                onChange={(e) => {
                  if (editingPosition) {
                    setEditingPosition({...editingPosition, description: e.target.value})
                  } else {
                    setNewPosition({...newPosition, description: e.target.value})
                  }
                }}
                placeholder="Enter position description"
              />
            </div>
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active-status"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={editingPosition ? editingPosition.active : newPosition.active}
                  onChange={(e) => {
                    if (editingPosition) {
                      setEditingPosition({...editingPosition, active: e.target.checked})
                    } else {
                      setNewPosition({...newPosition, active: e.target.checked})
                    }
                  }}
                />
                <label htmlFor="active-status" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingPosition(null)
                setNewPosition({
                  name: '',
                  description: '',
                  order: positions.length + 1,
                  active: true
                })
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={editingPosition ? handleUpdatePosition : handleAddPosition}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingPosition ? 'Update Position' : 'Add Position'}
            </button>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0">
          {/* Left side - Filter buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterActive(null)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filterActive === null ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Positions
            </button>
            <button
              onClick={() => setFilterActive(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filterActive === true ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterActive(false)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filterActive === false ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
          
          {/* Right side - Action buttons */}
          <div className="flex space-x-2 md:ml-auto">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Print position list"
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
                          checked={visibleColumns.name}
                          onChange={() => setVisibleColumns({...visibleColumns, name: !visibleColumns.name})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Name</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.description}
                          onChange={() => setVisibleColumns({...visibleColumns, description: !visibleColumns.description})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Description</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.order}
                          onChange={() => setVisibleColumns({...visibleColumns, order: !visibleColumns.order})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Order</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.status}
                          onChange={() => setVisibleColumns({...visibleColumns, status: !visibleColumns.status})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Status</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.actions}
                          onChange={() => setVisibleColumns({...visibleColumns, actions: !visibleColumns.actions})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Actions</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  S/N
                </th>
                {visibleColumns.order && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-20"
                    onClick={() => handleSort('order')}
                  >
                    <div className="flex items-center">
                      Order
                      {sortField === 'order' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                          <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.name && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Position Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                          <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.description && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                )}
                {visibleColumns.status && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                {visibleColumns.actions && (
                  <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredPositions.map((position, index) => (
                <tr key={position.id} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  {visibleColumns.order && (
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {position.order}
                    </td>
                  )}
                  {visibleColumns.name && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-indigo-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{position.name}</div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-500 max-w-md">{position.description}</div>
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        position.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {position.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleMovePosition(position.id, 'up')}
                          disabled={index === 0}
                          className={`p-1.5 rounded-md ${
                            index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100'
                          } transition-colors duration-200`}
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMovePosition(position.id, 'down')}
                          disabled={index === filteredPositions.length - 1}
                          className={`p-1.5 rounded-md ${
                            index === filteredPositions.length - 1
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100'
                          } transition-colors duration-200`}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(position.id)}
                          className={`p-1.5 rounded-md ${
                            position.active 
                              ? 'text-red-600 hover:text-red-900 hover:bg-red-100' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                          } transition-colors duration-200`}
                          title={position.active ? 'Deactivate' : 'Activate'}
                        >
                          {position.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => setEditingPosition(position)}
                          className="p-1.5 rounded-md text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 transition-colors duration-200"
                          title="Edit position"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePosition(position.id)}
                          className="p-1.5 rounded-md text-red-600 hover:text-red-900 hover:bg-red-100 transition-colors duration-200"
                          title="Delete position"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPositions.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No positions found matching your search criteria.
          </div>
        )}
        
        {/* Status bar with table information */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>
              Showing <span className="font-medium text-gray-900">{filteredPositions.length}</span> of <span className="font-medium text-gray-900">{positions.length}</span> positions
              {filterActive !== null && (
                <span> • {filterActive ? 'Active' : 'Inactive'} filter applied</span>
              )}
              {searchTerm && (
                <span> • Search: "{searchTerm}"</span>
              )}
            </span>
          </div>
          <div>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterActive(null)
              }}
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

export default PositionsManager