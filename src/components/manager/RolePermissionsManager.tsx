import React, { useState, useEffect, useRef } from 'react'
import { 
  Plus, Edit, Trash2, Search, 
  X, Check, AlertCircle, Download, RefreshCw,
  FileSpreadsheet, Printer, Columns, Info,
  Shield, ArrowUp, ArrowDown, Eye, User
} from 'lucide-react'

// Mock data for users
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', active: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Supervisor', active: true },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', active: true },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', active: false }
]

// Mock data for roles
const initialRoles = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    active: true,
    permissions: {
      dashboard: { view: true, edit: true, delete: true, add: true },
      positions: { view: true, edit: true, delete: true, add: true },
      candidates: { view: true, edit: true, delete: true, add: true },
      voters: { view: true, edit: true, delete: true, add: true },
      year: { view: true, edit: true, delete: true, add: true },
      class: { view: true, edit: true, delete: true, add: true },
      house: { view: true, edit: true, delete: true, add: true },
      results: { view: true, edit: true, delete: true, add: true },
      dva: { view: true, edit: true, delete: true, add: true },
      log: { view: true, edit: true, delete: true, add: true },
      settings: { view: true, edit: true, delete: true, add: true }
    }
  },
  {
    id: '2',
    name: 'Supervisor',
    description: 'View and edit access, no deletion',
    active: true,
    permissions: {
      dashboard: { view: true, edit: true, delete: false, add: true },
      positions: { view: true, edit: true, delete: false, add: true },
      candidates: { view: true, edit: true, delete: false, add: true },
      voters: { view: true, edit: true, delete: false, add: true },
      year: { view: true, edit: true, delete: false, add: true },
      class: { view: true, edit: true, delete: false, add: true },
      house: { view: true, edit: true, delete: false, add: true },
      results: { view: true, edit: true, delete: false, add: true },
      dva: { view: true, edit: true, delete: false, add: true },
      log: { view: true, edit: true, delete: false, add: true },
      settings: { view: true, edit: true, delete: false, add: true }
    }
  },
  {
    id: '3',
    name: 'Viewer',
    description: 'View-only access',
    active: true,
    permissions: {
      dashboard: { view: true, edit: false, delete: false, add: false },
      positions: { view: true, edit: false, delete: false, add: false },
      candidates: { view: true, edit: false, delete: false, add: false },
      voters: { view: true, edit: false, delete: false, add: false },
      year: { view: true, edit: false, delete: false, add: false },
      class: { view: true, edit: false, delete: false, add: false },
      house: { view: true, edit: false, delete: false, add: false },
      results: { view: true, edit: false, delete: false, add: false },
      dva: { view: true, edit: false, delete: false, add: false },
      log: { view: true, edit: false, delete: false, add: false },
      settings: { view: true, edit: false, delete: false, add: false }
    }
  }
]

interface Permission {
  view: boolean
  edit: boolean
  delete: boolean
  add: boolean
}

interface Role {
  id: string
  name: string
  description: string
  active: boolean
  permissions: Record<string, Permission>
}

interface User {
  id: string
  name: string
  email: string
  role: string
  active: boolean
}

const availablePages = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'positions', name: 'Positions' },
  { id: 'candidates', name: 'Candidates' },
  { id: 'voters', name: 'Voters' },
  { id: 'year', name: 'Year' },
  { id: 'class', name: 'Class' },
  { id: 'house', name: 'House' },
  { id: 'results', name: 'Results' },
  { id: 'dva', name: 'DVA' },
  { id: 'log', name: 'Activity Log' },
  { id: 'settings', name: 'Settings' }
]

const permissionTypes = [
  { id: 'view', name: 'View', icon: <Eye className="h-4 w-4" /> },
  { id: 'edit', name: 'Edit', icon: <Edit className="h-4 w-4" /> },
  { id: 'delete', name: 'Delete', icon: <Trash2 className="h-4 w-4" /> },
  { id: 'add', name: 'Add', icon: <Plus className="h-4 w-4" /> }
]

const RolePermissionsManager: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [sortField, setSortField] = useState<'name'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const columnSelectorRef = useRef<HTMLDivElement>(null)
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    description: true,
    users: true,
    status: true,
    actions: true
  })
  
  // Form state
  const [newRole, setNewRole] = useState<Role>({
    id: '',
    name: '',
    description: '',
    active: true,
    permissions: availablePages.reduce((acc, page) => {
      acc[page.id] = { view: false, edit: false, delete: false, add: false }
      return acc
    }, {} as Record<string, Permission>)
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

  // Filter and sort roles
  const filteredRoles = roles
    .filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterActive === null || role.active === filterActive)
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

  const handleAddRole = () => {
    if (!newRole.name) {
      setNotification({
        type: 'error',
        message: 'Role name is required'
      })
      return
    }

    // Check if role already exists
    if (roles.some(r => r.name === newRole.name)) {
      setNotification({
        type: 'error',
        message: 'Role already exists'
      })
      return
    }

    const newId = (Math.max(...roles.map(r => parseInt(r.id))) + 1).toString()
    
    setRoles([
      ...roles,
      {
        ...newRole,
        id: newId
      }
    ])
    
    setNewRole({
      id: '',
      name: '',
      description: '',
      active: true,
      permissions: availablePages.reduce((acc, page) => {
        acc[page.id] = { view: false, edit: false, delete: false, add: false }
        return acc
      }, {} as Record<string, Permission>)
    })
    
    setShowAddForm(false)
    setNotification({
      type: 'success',
      message: 'Role added successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleUpdateRole = () => {
    if (!editingRole) return
    
    if (!editingRole.name) {
      setNotification({
        type: 'error',
        message: 'Role name is required'
      })
      return
    }
    
    // Check if role name already exists (excluding the current role)
    if (roles.some(r => r.name === editingRole.name && r.id !== editingRole.id)) {
      setNotification({
        type: 'error',
        message: 'Role already exists'
      })
      return
    }
    
    setRoles(roles.map(role => 
      role.id === editingRole.id ? editingRole : role
    ))
    
    setEditingRole(null)
    setNotification({
      type: 'success',
      message: 'Role updated successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleDeleteRole = (id: string) => {
    // Check if role has any users
    if (users.some(user => user.role === roles.find(r => r.id === id)?.name)) {
      setNotification({
        type: 'error',
        message: 'Cannot delete role with assigned users'
      })
      return
    }
    
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== id))
      setNotification({
        type: 'success',
        message: 'Role deleted successfully'
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleToggleActive = (id: string) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, active: !role.active } : role
    ))
    
    setNotification({
      type: 'success',
      message: 'Role status updated'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Handle permission change
  const handlePermissionChange = (
    roleId: string | null, 
    pageId: string, 
    permissionType: keyof Permission, 
    value: boolean
  ) => {
    if (roleId) {
      // Editing existing role
      setEditingRole(prev => {
        if (!prev) return prev
        
        // Special handling: if turning off 'view', also turn off all other permissions
        if (permissionType === 'view' && !value) {
          return {
            ...prev,
            permissions: {
              ...prev.permissions,
              [pageId]: { view: false, edit: false, delete: false, add: false }
            }
          }
        }
        
        // Special handling: if turning on any other permission, also turn on 'view'
        if (permissionType !== 'view' && value) {
          return {
            ...prev,
            permissions: {
              ...prev.permissions,
              [pageId]: { 
                ...prev.permissions[pageId], 
                [permissionType]: value,
                view: true 
              }
            }
          }
        }
        
        // Normal case
        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            [pageId]: { 
              ...prev.permissions[pageId], 
              [permissionType]: value 
            }
          }
        }
      })
    } else {
      // Adding new role
      setNewRole(prev => {
        // Special handling: if turning off 'view', also turn off all other permissions
        if (permissionType === 'view' && !value) {
          return {
            ...prev,
            permissions: {
              ...prev.permissions,
              [pageId]: { view: false, edit: false, delete: false, add: false }
            }
          }
        }
        
        // Special handling: if turning on any other permission, also turn on 'view'
        if (permissionType !== 'view' && value) {
          return {
            ...prev,
            permissions: {
              ...prev.permissions,
              [pageId]: { 
                ...prev.permissions[pageId], 
                [permissionType]: value,
                view: true 
              }
            }
          }
        }
        
        // Normal case
        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            [pageId]: { 
              ...prev.permissions[pageId], 
              [permissionType]: value 
            }
          }
        }
      })
    }
  }

  // Handle setting all permissions for a page
  const handleSetAllPermissions = (roleId: string | null, pageId: string, value: boolean) => {
    if (roleId) {
      // Editing existing role
      setEditingRole(prev => {
        if (!prev) return prev
        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            [pageId]: { view: value, edit: value, delete: value, add: value }
          }
        }
      })
    } else {
      // Adding new role
      setNewRole(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [pageId]: { view: value, edit: value, delete: value, add: value }
        }
      }))
    }
  }

  // Handle setting all permissions for all pages
  const handleSetAllPermissionsForAll = (roleId: string | null, value: boolean) => {
    const allPermissions = availablePages.reduce((acc, page) => {
      acc[page.id] = { view: value, edit: value, delete: value, add: value }
      return acc
    }, {} as Record<string, Permission>)
    
    if (roleId) {
      // Editing existing role
      setEditingRole(prev => {
        if (!prev) return prev
        return {
          ...prev,
          permissions: allPermissions
        }
      })
    } else {
      // Adding new role
      setNewRole(prev => ({
        ...prev,
        permissions: allPermissions
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold">Role & Permission Management</h2>
          <p className="text-indigo-100 text-sm font-sans font-light">Manage user roles and their access permissions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingRole(null)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Role
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
      {(showAddForm || editingRole) && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center">
            {editingRole ? (
              <>
                <Edit className="h-5 w-5 text-indigo-500 mr-2" />
                Edit Role
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-indigo-500 mr-2" />
                Add New Role
              </>
            )}
          </h3>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingRole ? editingRole.name : newRole.name}
                onChange={(e) => {
                  if (editingRole) {
                    setEditingRole({...editingRole, name: e.target.value})
                  } else {
                    setNewRole({...newRole, name: e.target.value})
                  }
                }}
                placeholder="Enter role name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingRole ? editingRole.description : newRole.description}
                onChange={(e) => {
                  if (editingRole) {
                    setEditingRole({...editingRole, description: e.target.value})
                  } else {
                    setNewRole({...newRole, description: e.target.value})
                  }
                }}
                placeholder="Enter description"
              />
            </div>
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active-status"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={editingRole ? editingRole.active : newRole.active}
                  onChange={(e) => {
                    if (editingRole) {
                      setEditingRole({...editingRole, active: e.target.checked})
                    } else {
                      setNewRole({...newRole, active: e.target.checked})
                    }
                  }}
                />
                <label htmlFor="active-status" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Inactive roles will not be available for assignment to users.
              </p>
            </div>
          </div>
          
          {/* Permissions Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-medium text-gray-900 flex items-center">
                <Shield className="h-5 w-5 text-indigo-500 mr-2" />
                Permissions
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSetAllPermissionsForAll(editingRole?.id || null, true)}
                  className="px-2 py-1 text-xs font-medium rounded border border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                >
                  Grant All
                </button>
                <button
                  onClick={() => handleSetAllPermissionsForAll(editingRole?.id || null, false)}
                  className="px-2 py-1 text-xs font-medium rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                >
                  Revoke All
                </button>
              </div>
            </div>
            
            {/* Permissions Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page/Feature
                    </th>
                    {permissionTypes.map(type => (
                      <th key={type.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-center">
                          {type.icon}
                          <span className="ml-1">{type.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availablePages.map(page => (
                    <tr key={page.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {page.name}
                      </td>
                      {permissionTypes.map(type => (
                        <td key={type.id} className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={
                              editingRole 
                                ? editingRole.permissions[page.id]?.[type.id as keyof Permission] || false
                                : newRole.permissions[page.id]?.[type.id as keyof Permission] || false
                            }
                            onChange={(e) => handlePermissionChange(
                              editingRole?.id || null,
                              page.id,
                              type.id as keyof Permission,
                              e.target.checked
                            )}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingRole(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={editingRole ? handleUpdateRole : handleAddRole}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingRole ? 'Update Role' : 'Add Role'}
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
              All Roles
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
                          checked={visibleColumns.users}
                          onChange={() => setVisibleColumns({...visibleColumns, users: !visibleColumns.users})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Users</span>
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
                          className="h-4 w-4 text-indigo-600 focus:ring- indigo-500 border-gray-300 rounded"
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
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Roles Table */}
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
                      Role Name
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
                {visibleColumns.users && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
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
              {filteredRoles.map((role, index) => (
                <tr key={role.id} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  {visibleColumns.name && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-indigo-500 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-500">{role.description}</div>
                    </td>
                  )}
                  {visibleColumns.users && (
                    <td className="px-3 py-4">
                      <div className="flex -space-x-2">
                        {users
                          .filter(user => user.role === role.name)
                          .slice(0, 3)
                          .map((user, i) => (
                            <div
                              key={user.id}
                              className="h-8 w-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                              title={user.name}
                            >
                              <User className="h-4 w-4 text-indigo-600" />
                            </div>
                          ))}
                        {users.filter(user => user.role === role.name).length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{users.filter(user => user.role === role.name).length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        role.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {role.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleActive(role.id)}
                          className={`p-1.5 rounded-md ${
                            role.active 
                              ? 'text-red-600 hover:text-red-900 hover:bg-red-100' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                          } transition-colors duration-200`}
                          title={role.active ? 'Deactivate' : 'Activate'}
                        >
                          {role.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => setEditingRole(role)}
                          className="p-1.5 rounded-md text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 transition-colors duration-200"
                          title="Edit role"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-1.5 rounded-md text-red-600 hover:text-red-900 hover:bg-red-100 transition-colors duration-200"
                          title="Delete role"
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
        
        {filteredRoles.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No roles found matching your search criteria.
          </div>
        )}
        
        {/* Status bar with table information */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>
              Showing <span className="font-medium text-gray-900">{filteredRoles.length}</span> of <span className="font-medium text-gray-900">{roles.length}</span> roles
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

export default RolePermissionsManager