import React, { useState, useEffect, useRef } from 'react'
import { 
  Plus, Edit, Trash2, Search, 
  X, Check, AlertCircle, Download, RefreshCw,
  FileSpreadsheet, Printer, Columns, Info,
  Home, ArrowUp, ArrowDown
} from 'lucide-react'

// Mock data
const initialHouses = [
  { id: '1', name: 'Red House', description: 'Addo Dankwa House', color: '#ef4444', active: true },
  { id: '2', name: 'Blue House', description: 'Osei Tutu House', color: '#3b82f6', active: true },
  { id: '3', name: 'Green House', description: 'Opoku Ware House', color: '#10b981', active: true },
  { id: '4', name: 'Yellow House', description: 'Yaa Asantewaa House', color: '#f59e0b', active: true },
  { id: '5', name: 'Purple House', description: 'Prempeh House', color: '#8b5cf6', active: false }
]

interface House {
  id: string
  name: string
  description: string
  color: string
  active: boolean
}

const colorOptions = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Custom', value: 'custom' }
]

const HouseManager: React.FC = () => {
  const [houses, setHouses] = useState<House[]>(initialHouses)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHouse, setEditingHouse] = useState<House | null>(null)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [sortField, setSortField] = useState<'name'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const columnSelectorRef = useRef<HTMLDivElement>(null)
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    description: true,
    color: true,
    status: true,
    actions: true
  })
  
  // Form state
  const [newHouse, setNewHouse] = useState({
    name: '',
    description: '',
    color: '#ef4444',
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

  // Filter and sort houses
  const filteredHouses = houses
    .filter(house => 
      house.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterActive === null || house.active === filterActive)
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name)
      }
      return 0
    })

  const handleSort = (field: 'name') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleAddHouse = () => {
    if (!newHouse.name) {
      setNotification({
        type: 'error',
        message: 'House name is required'
      })
      return
    }

    // Check if house already exists
    if (houses.some(h => h.name === newHouse.name)) {
      setNotification({
        type: 'error',
        message: 'House already exists'
      })
      return
    }

    const newId = (Math.max(...houses.map(h => parseInt(h.id))) + 1).toString()
    
    setHouses([
      ...houses,
      {
        id: newId,
        ...newHouse
      }
    ])
    
    setNewHouse({
      name: '',
      description: '',
      color: '#ef4444',
      active: true
    })
    
    setShowAddForm(false)
    setNotification({
      type: 'success',
      message: 'House added successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleUpdateHouse = () => {
    if (!editingHouse) return
    
    if (!editingHouse.name) {
      setNotification({
        type: 'error',
        message: 'House name is required'
      })
      return
    }
    
    // Check if house name already exists (excluding the current house)
    if (houses.some(h => h.name === editingHouse.name && h.id !== editingHouse.id)) {
      setNotification({
        type: 'error',
        message: 'House already exists'
      })
      return
    }
    
    setHouses(houses.map(house => 
      house.id === editingHouse.id ? editingHouse : house
    ))
    
    setEditingHouse(null)
    setNotification({
      type: 'success',
      message: 'House updated successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleDeleteHouse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this house?')) {
      setHouses(houses.filter(house => house.id !== id))
      setNotification({
        type: 'success',
        message: 'House deleted successfully'
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleToggleActive = (id: string) => {
    setHouses(houses.map(house => 
      house.id === id ? { ...house, active: !house.active } : house
    ))
    
    setNotification({
      type: 'success',
      message: 'House status updated'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Get color name from value
  const getColorName = (colorValue: string) => {
    const color = colorOptions.find(c => c.value === colorValue)
    return color ? color.name : 'Custom'
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Title and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold">House Management</h2>
          <p className="text-indigo-100 text-sm font-sans font-light">Manage school houses for elections</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingHouse(null)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add House
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
      {(showAddForm || editingHouse) && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center">
            {editingHouse ? (
              <>
                <Edit className="h-5 w-5 text-indigo-500 mr-2" />
                Edit House
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-indigo-500 mr-2" />
                Add New House
              </>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingHouse ? editingHouse.name : newHouse.name}
                onChange={(e) => {
                  if (editingHouse) {
                    setEditingHouse({...editingHouse, name: e.target.value})
                  } else {
                    setNewHouse({...newHouse, name: e.target.value})
                  }
                }}
                placeholder="Enter house name (e.g., Red House)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingHouse ? editingHouse.description : newHouse.description}
                onChange={(e) => {
                  if (editingHouse) {
                    setEditingHouse({...editingHouse, description: e.target.value})
                  } else {
                    setNewHouse({...newHouse, description: e.target.value})
                  }
                }}
                placeholder="Enter description (e.g., Named after...)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House Color</label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{ backgroundColor: editingHouse ? editingHouse.color : newHouse.color }}
                ></div>
                <select
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={editingHouse ? editingHouse.color : newHouse.color}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'custom') {
                      const colorPicker = document.createElement('input');
                      colorPicker.type = 'color';
                      colorPicker.click();
                      colorPicker.addEventListener('change', (e) => {
                        if (editingHouse) {
                          setEditingHouse({...editingHouse, color: e.target.value});
                        } else {
                          setNewHouse({...newHouse, color: e.target.value});
                        }
                      });
                    } else {
                      if (editingHouse) {
                        setEditingHouse({...editingHouse, color: value});
                      } else {
                        setNewHouse({...newHouse, color: value});
                      }
                    }
                  }}
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>{color.name}</option>
                  ))}
                </select>
                <input
                  type="color"
                  className="hidden"
                  value={editingHouse ? editingHouse.color : newHouse.color}
                  onChange={(e) => {
                    if (editingHouse) {
                      setEditingHouse({...editingHouse, color: e.target.value});
                    } else {
                      setNewHouse({...newHouse, color: e.target.value});
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active-status"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={editingHouse ? editingHouse.active : newHouse.active}
                  onChange={(e) => {
                    if (editingHouse) {
                      setEditingHouse({...editingHouse, active: e.target.checked})
                    } else {
                      setNewHouse({...newHouse, active: e.target.checked})
                    }
                  }}
                />
                <label htmlFor="active-status" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Only active houses will be available for selection in the voting system.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingHouse(null)
                setNewHouse({
                  name: '',
                  description: '',
                  color: '#ef4444',
                  active: true
                })
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={editingHouse ? handleUpdateHouse : handleAddHouse}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingHouse ? 'Update House' : 'Add House'}
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
              All Houses
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
              onClick={() => {}}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Print house list"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              Print
            </button>
            <button
              onClick={() => {}}
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
                          checked={visibleColumns.color}
                          onChange={() => setVisibleColumns({...visibleColumns, color: !visibleColumns.color})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Color</span>
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
              placeholder="Search houses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Houses Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  S/N
                </th>
                {visibleColumns.name && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      House Name
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
                {visibleColumns.color && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
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
              {filteredHouses.map((house, index) => (
                <tr key={house.id} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  {visibleColumns.name && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Home className="h-5 w-5 text-indigo-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{house.name}</div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-500">{house.description}</div>
                    </td>
                  )}
                  {visibleColumns.color && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: house.color }}
                        ></div>
                        <span className="text-sm text-gray-900">{getColorName(house.color)}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        house.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {house.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleActive(house.id)}
                          className={`p-1.5 rounded-md ${
                            house.active 
                              ? 'text-red-600 hover:text-red-900 hover:bg-red-100' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                          } transition-colors duration-200`}
                          title={house.active ? 'Deactivate' : 'Activate'}
                        >
                          {house.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => setEditingHouse(house)}
                          className="p-1.5 rounded-md text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 transition-colors duration-200"
                          title="Edit house"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteHouse(house.id)}
                          className="p-1.5 rounded-md text-red-600 hover:text-red-900 hover:bg-red-100 transition-colors duration-200"
                          title="Delete house"
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
        
        {filteredHouses.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No houses found matching your search criteria.
          </div>
        )}
        
        {/* Status bar with table information */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>
              Showing <span className="font-medium text-gray-900">{filteredHouses.length}</span> of <span className="font-medium text-gray-900">{houses.length}</span> houses
              {filterActive !== null && (
                <span> • {filterActive ? 'Active' : 'Inactive'} filter applied</span> )}
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

export default HouseManager