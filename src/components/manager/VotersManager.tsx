import React, { useState, useRef, useEffect } from 'react'
import { 
  Plus, Edit, Trash2, Search, 
  X, Check, AlertCircle, Download, RefreshCw,
  FileSpreadsheet, Printer, Columns, Info,
  Users, ArrowUp, ArrowDown, KeyRound
} from 'lucide-react'

// Mock data
const initialVoters = [
  { id: '1', voterId: 'VOTER2025', name: 'John Doe', gender: 'Male', class: 'Form 3A', hasVoted: false, votedAt: null },
  { id: '2', voterId: 'VOTER2024', name: 'Jane Smith', gender: 'Female', class: 'Form 3B', hasVoted: true, votedAt: new Date('2025-05-15T10:30:45') },
  { id: '3', voterId: 'VOTER2023', name: 'Kwame Asante', gender: 'Male', class: 'Form 3A', hasVoted: true, votedAt: new Date('2025-05-15T09:15:22') },
  { id: '4', voterId: 'VOTER2022', name: 'Abena Mensah', gender: 'Female', class: 'Form 3C', hasVoted: false, votedAt: null },
  { id: '5', voterId: 'VOTER2021', name: 'Kofi Owusu', gender: 'Male', class: 'Form 3B', hasVoted: true, votedAt: new Date('2025-05-15T11:45:10') },
  { id: '6', voterId: 'VOTER2020', name: 'Ama Serwaa', gender: 'Female', class: 'Form 3A', hasVoted: false, votedAt: null },
  { id: '7', voterId: 'VOTER2019', name: 'Yaw Boateng', gender: 'Male', class: 'Form 3C', hasVoted: true, votedAt: new Date('2025-05-15T08:20:33') },
  { id: '8', voterId: 'VOTER2018', name: 'Akua Manu', gender: 'Female', class: 'Form 3B', hasVoted: false, votedAt: null }
]

interface Voter {
  id: string
  voterId: string
  name: string
  gender: string
  class: string
  hasVoted: boolean
  votedAt: Date | null
}

const VotersManager: React.FC = () => {
  const [voters, setVoters] = useState<Voter[]>(initialVoters)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVoted, setFilterVoted] = useState<boolean | null>(null)
  const [filterGender, setFilterGender] = useState<string>('')
  const [filterClass, setFilterClass] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [sortField, setSortField] = useState<'name' | 'class'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const columnSelectorRef = useRef<HTMLDivElement>(null)
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState({
    voterId: true,
    name: true,
    gender: true,
    class: true,
    status: true,
    actions: true
  })
  
  // Form state
  const [newVoter, setNewVoter] = useState({
    voterId: '',
    name: '',
    gender: '',
    class: '',
    hasVoted: false,
    votedAt: null
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

  // Filter and sort voters
  const filteredVoters = voters
    .filter(voter => 
      (voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       voter.voterId.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterVoted === null || voter.hasVoted === filterVoted) &&
      (filterGender === '' || voter.gender === filterGender) &&
      (filterClass === '' || voter.class === filterClass)
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name)
      } else if (sortField === 'class') {
        return sortDirection === 'asc' 
          ? a.class.localeCompare(b.class) 
          : b.class.localeCompare(a.class)
      }
      return 0
    })

  // Get unique classes and genders for filters
  const uniqueClasses = Array.from(new Set(voters.map(v => v.class))).sort()
  const uniqueGenders = Array.from(new Set(voters.map(v => v.gender))).sort()

  const handleSort = (field: 'name' | 'class') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleAddVoter = () => {
    if (!newVoter.name || !newVoter.class || !newVoter.gender) {
      setNotification({
        type: 'error',
        message: 'All fields are required'
      })
      return
    }

    // Generate a unique voter ID
    const voterId = `VOTER${Math.floor(Math.random() * 9000) + 1000}`
    const newId = (Math.max(...voters.map(v => parseInt(v.id))) + 1).toString()
    
    const voterData = { 
      ...newVoter, 
      id: newId,
      voterId,
      hasVoted: false,
      votedAt: null
    }
    
    setVoters([...voters, voterData])
    setNewVoter({
      voterId: '',
      name: '',
      gender: '',
      class: '',
      hasVoted: false,
      votedAt: null
    })
    
    setShowAddForm(false)
    setNotification({
      type: 'success',
      message: 'Voter added successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleUpdateVoter = () => {
    if (!editingVoter) return
    
    if (!editingVoter.name || !editingVoter.class || !editingVoter.gender) {
      setNotification({
        type: 'error',
        message: 'All fields are required'
      })
      return
    }
    
    setVoters(voters.map(voter => 
      voter.id === editingVoter.id ? editingVoter : voter
    ))
    
    setEditingVoter(null)
    setNotification({
      type: 'success',
      message: 'Voter updated successfully'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleDeleteVoter = (id: string) => {
    const voter = voters.find(v => v.id === id)
    if (voter?.hasVoted) {
      setNotification({
        type: 'error',
        message: 'Cannot delete a voter who has already voted'
      })
      return
    }
    
    if (window.confirm('Are you sure you want to delete this voter?')) {
      setVoters(voters.filter(voter => voter.id !== id))
      setNotification({
        type: 'success',
        message: 'Voter deleted successfully'
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleRegenerateVoterId = (id: string) => {
    const voter = voters.find(v => v.id === id)
    if (voter?.hasVoted) {
      setNotification({
        type: 'error',
        message: 'Cannot regenerate Voter ID after voting'
      })
      return
    }
    
    if (window.confirm('Are you sure you want to regenerate this Voter ID?')) {
      const newVoterId = `VOTER${Math.floor(Math.random() * 9000) + 1000}`
      
      setVoters(voters.map(voter => 
        voter.id === id ? { ...voter, voterId: newVoterId } : voter
      ))
      
      setNotification({
        type: 'success',
        message: 'Voter ID regenerated successfully'
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  // Format date and time
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date)
  }

  return (
    <div className="space-y-4">
      {/* Page Header with Title and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-3 rounded-lg shadow-md">
        <div>
          <h2 className="text-lg font-bold">Voter Management</h2>
          <p className="text-indigo-100 text-xs font-sans font-light">Manage voters and monitor voting status</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingVoter(null)
            }}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Voter
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-3 rounded-md ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        } flex justify-between items-start shadow-sm`}>
          <div className="flex">
            {notification.type === 'success' ? (
              <Check className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
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
      {(showAddForm || editingVoter) && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingVoter ? 'Edit Voter' : 'Add New Voter'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingVoter ? editingVoter.name : newVoter.name}
                onChange={(e) => {
                  if (editingVoter) {
                    setEditingVoter({...editingVoter, name: e.target.value})
                  } else {
                    setNewVoter({...newVoter, name: e.target.value})
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingVoter ? editingVoter.gender : newVoter.gender}
                onChange={(e) => {
                  if (editingVoter) {
                    setEditingVoter({...editingVoter, gender: e.target.value})
                  } else {
                    setNewVoter({...newVoter, gender: e.target.value})
                  }
                }}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingVoter ? editingVoter.class : newVoter.class}
                onChange={(e) => {
                  if (editingVoter) {
                    setEditingVoter({...editingVoter, class: e.target.value})
                  } else {
                    setNewVoter({...newVoter, class: e.target.value})
                  }
                }}
              >
                <option value="">Select class</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingVoter(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={editingVoter ? handleUpdateVoter : handleAddVoter}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {editingVoter ? 'Update' : 'Add'} Voter
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterVoted(null)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filterVoted === null ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Voters
          </button>
          <button
            onClick={() => setFilterVoted(true)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filterVoted === true ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Voted
          </button>
          <button
            onClick={() => setFilterVoted(false)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              filterVoted === false ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Not Voted
          </button>
          
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search voters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <select
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="">All Genders</option>
            {uniqueGenders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
          
          <select
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          
          <div className="relative" ref={columnSelectorRef}>
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Columns className="h-4 w-4" />
            </button>
            
            {showColumnSelector && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Show/Hide Columns</div>
                  {Object.entries(visibleColumns).map(([key, value]) => (
                    <label key={key} className="flex items-center p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => setVisibleColumns({
                          ...visibleColumns,
                          [key]: !value
                        })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                {visibleColumns.voterId && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voter ID
                  </th>
                )}
                {visibleColumns.name && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1" /> : 
                          <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.gender && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                )}
                {visibleColumns.class && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('class')}
                  >
                    <div className="flex items-center">
                      Class
                      {sortField === 'class' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1" /> : 
                          <ArrowDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.status && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Voted
                </th>
                {visibleColumns.actions && (
                  <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVoters.map((voter, index) => (
                <tr key={voter.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  {visibleColumns.voterId && (
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {voter.voterId}
                    </td>
                  )}
                  {visibleColumns.name && (
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {voter.name}
                    </td>
                  )}
                  {visibleColumns.gender && (
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {voter.gender}
                    </td>
                  )}
                  {visibleColumns.class && (
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {voter.class}
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        voter.hasVoted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {voter.hasVoted ? 'Voted' : 'Not Voted'}
                      </span>
                    </td>
                  )}
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voter.hasVoted && voter.votedAt ? formatDateTime(voter.votedAt) : '-'}
                  </td>
                  {visibleColumns.actions && (
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRegenerateVoterId(voter.id)}
                        className={`text-indigo-600 hover:text-indigo-900 ${
                          voter.hasVoted ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={voter.hasVoted}
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingVoter(voter)}
                        className="ml-2 text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVoter(voter.id)}
                        className={`ml-2 text-red-600 hover:text-red-900 ${
                          voter.hasVoted ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={voter.hasVoted}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredVoters.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No voters found matching your criteria
          </div>
        )}
      </div>

      {/* Table Information */}
      <div className="bg-white p-4 rounded-lg shadow-md text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>
              Showing <span className="font-medium text-gray-900">{filteredVoters.length}</span> of{' '}
              <span className="font-medium text-gray-900">{voters.length}</span> voters
            </span>
          </div>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterVoted(null)
              setFilterGender('')
              setFilterClass('')
            }}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default VotersManager