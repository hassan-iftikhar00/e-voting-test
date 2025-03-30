import React, { useState, useEffect, useRef } from 'react'
import { 
  Plus, Edit, Trash2, Search, 
  X, Check, AlertCircle, Download, RefreshCw,
  FileSpreadsheet, Printer, Columns, Info,
  Users, ArrowUp, ArrowDown, Filter
} from 'lucide-react'

// Mock data
const initialCandidates = [
  { 
    id: '1', 
    name: 'John Mensah', 
    position: 'Senior Prefect',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    description: 'Dedicated student leader with strong academic performance',
    class: 'Form 3A',
    active: true,
    displayOrder: 1,
    voterCategory: {
      type: 'all', // 'all', 'year', 'class', 'house'
      values: [] // For specific year, class, or house restrictions
    }
  },
  { 
    id: '2', 
    name: 'Abena Osei', 
    position: 'Senior Prefect',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    description: 'Experienced in student leadership and community service',
    class: 'Form 3B',
    active: true,
    displayOrder: 2,
    voterCategory: {
      type: 'class',
      values: ['Form 3A', 'Form 3B']
    }
  },
  { 
    id: '3', 
    name: 'Kofi Adu', 
    position: 'Dining Hall Prefect',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    description: 'Passionate about food service and student welfare',
    class: 'Form 3A',
    active: true,
    displayOrder: 3,
    voterCategory: {
      type: 'house',
      values: ['Red House', 'Blue House']
    }
  }
]

interface VoterCategory {
  type: 'all' | 'year' | 'class' | 'house'
  values: string[]
}

interface Candidate {
  id: string
  name: string
  position: string
  imageUrl: string
  description: string
  class: string
  active: boolean
  displayOrder: number
  voterCategory: VoterCategory
}

const positions = ['Senior Prefect', 'Dining Hall Prefect', 'Sports Prefect', 'Library Prefect']
const classes = ['Form 3A', 'Form 3B', 'Form 3C']
const years = ['2023', '2024', '2025']
const houses = ['Red House', 'Blue House', 'Green House', 'Yellow House']

const CandidatesManager: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [filterPosition, setFilterPosition] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [sortField, setSortField] = useState<'name' | 'position'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const columnSelectorRef = useRef<HTMLDivElement>(null)
  
  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    position: true,
    class: true,
    description: true,
    voterCategory: true,
    status: true,
    actions: true
  })
  
  // Form state
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: '',
    imageUrl: '',
    description: '',
    class: '',
    active: true,
    voterCategory: {
      type: 'all',
      values: [] as string[]
    }
  })

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

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

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => 
      (candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       candidate.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterActive === null || candidate.active === filterActive) &&
      (filterPosition === '' || candidate.position === filterPosition) &&
      (filterClass === '' || candidate.class === filterClass)
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name)
      } else if (sortField === 'position') {
        return sortDirection === 'asc' 
          ? a.position.localeCompare(b.position) 
          : b.position.localeCompare(a.position)
      }
      return 0
    })

  const handleSort = (field: 'name' | 'position') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      if (editingCandidate) {
        setEditingCandidate({
          ...editingCandidate,
          imageUrl: url
        })
      } else {
        setNewCandidate({
          ...newCandidate,
          imageUrl: url
        })
      }
    }
  }

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.position || !newCandidate.class) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      })
      return
    }

    if (!newCandidate.imageUrl) {
      setNotification({
        type: 'error',
        message: 'Please upload a candidate photo'
      })
      return
    }

    // Validate voter category
    if (newCandidate.voterCategory.type !== 'all' && newCandidate.voterCategory.values.length === 0) {
      setNotification({
        type: 'error',
        message: 'Please select at least one value for the voter category restriction'
      })
      return
    }

    const newId = (Math.max(...candidates.map(c => parseInt(c.id))) + 1).toString()
    const maxDisplayOrder = Math.max(...candidates.map(c => c.displayOrder), 0)
    
    setCandidates([
      ...candidates,
      {
        ...newCandidate,
        id: newId,
        displayOrder: maxDisplayOrder + 1
      } as Candidate
    ])

    setNewCandidate({
      name: '',
      position: '',
      imageUrl: '',
      description: '',
      class: '',
      active: true,
      voterCategory: {
        type: 'all',
        values: []
      }
    })
    
    setSelectedFile(null)
    setPreviewUrl('')
    setShowAddForm(false)
    
    setNotification({
      type: 'success',
      message: 'Candidate added successfully'
    })
    
    setTimeout(() => setNotification(null), 3000)
  }

  const handleUpdateCandidate = () => {
    if (!editingCandidate) return

    if (!editingCandidate.name || !editingCandidate.position || !editingCandidate.class) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      })
      return
    }

    if (!editingCandidate.imageUrl) {
      setNotification({
        type: 'error',
        message: 'Please upload a candidate photo'
      })
      return
    }

    // Validate voter category
    if (editingCandidate.voterCategory.type !== 'all' && editingCandidate.voterCategory.values.length === 0) {
      setNotification({
        type: 'error',
        message: 'Please select at least one value for the voter category restriction'
      })
      return
    }

    setCandidates(candidates.map(candidate => 
      candidate.id === editingCandidate.id ? editingCandidate : candidate
    ))

    setEditingCandidate(null)
    setSelectedFile(null)
    setPreviewUrl('')
    
    setNotification({
      type: 'success',
      message: 'Candidate updated successfully'
    })
    
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDeleteCandidate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      setCandidates(candidates.filter(candidate => candidate.id !== id))
      setNotification({
        type: 'success',
        message: 'Candidate deleted successfully'
      })
      
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }
  }

  const handleToggleActive = (id: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, active: !candidate.active } : candidate
    ))
    
    setNotification({
      type: 'success',
      message: 'Candidate status updated'
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleMovePosition = (id: string, direction: 'up' | 'down') => {
    const candidateIndex = candidates.findIndex(c => c.id === id)
    if (
      (direction === 'up' && candidateIndex === 0) || 
      (direction === 'down' && candidateIndex === candidates.length - 1)
    ) {
      return
    }
    
    const newCandidates = [...candidates]
    const targetIndex = direction === 'up' ? candidateIndex - 1 : candidateIndex + 1
    
    // Swap display orders
    const tempOrder = newCandidates[candidateIndex].displayOrder
    newCandidates[candidateIndex].displayOrder = newCandidates[targetIndex].displayOrder
    newCandidates[targetIndex].displayOrder = tempOrder
    
    // Sort by display order
    newCandidates.sort((a, b) => a.displayOrder - b.displayOrder)
    
    setCandidates(newCandidates)
    setNotification({
      type: 'success',
      message: `Candidate moved ${direction}`
    })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleVoterCategoryChange = (type: VoterCategory['type'], value: string, checked: boolean) => {
    if (editingCandidate) {
      setEditingCandidate(prev => {
        if (!prev) return prev
        return {
          ...prev,
          voterCategory: {
            type,
            values: checked 
              ? [...prev.voterCategory.values, value]
              : prev.voterCategory.values.filter(v => v !== value)
          }
        }
      })
    } else {
      setNewCandidate(prev => ({
        ...prev,
        voterCategory: {
          type,
          values: checked
            ? [...prev.voterCategory.values, value]
            : prev.voterCategory.values.filter(v => v !== value)
        }
      }))
    }
  }

  const getVoterCategoryLabel = (category: VoterCategory) => {
    if (category.type === 'all') return 'All Voters'
    return `${category.values.join(', ')} Only`
  }

  const getAvailableOptions = (type: VoterCategory['type']) => {
    switch (type) {
      case 'year':
        return years
      case 'class':
        return classes
      case 'house':
        return houses
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Title and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold">Candidate Management</h2>
          <p className="text-indigo-100 text-sm font-sans font-light">Manage election candidates and their positions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingCandidate(null)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
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
      {(showAddForm || editingCandidate) && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center">
            {editingCandidate ? (
              <>
                <Edit className="h-5 w-5 text-indigo-500 mr-2" />
                Edit Candidate
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-indigo-500 mr-2" />
                Add New Candidate
              </>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Photo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg overflow-hidden">
                  {(editingCandidate?.imageUrl || previewUrl) ? (
                    <img 
                      src={editingCandidate?.imageUrl || previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Users className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="relative cursor-pointer">
                    <input 
                      type="file" 
                      className="sr-only" 
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <div className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Browse...
                    </div>
                  </label>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingCandidate ? editingCandidate.name : newCandidate.name}
                onChange={(e) => {
                  if (editingCandidate) {
                    setEditingCandidate({...editingCandidate, name: e.target.value})
                  } else {
                    setNewCandidate({...newCandidate, name: e.target.value})
                  }
                }}
                placeholder="Enter candidate name"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingCandidate ? editingCandidate.position : newCandidate.position}
                onChange={(e) => {
                  if (editingCandidate) {
                    setEditingCandidate({...editingCandidate, position: e.target.value})
                  } else {
                    setNewCandidate({...newCandidate, position: e.target.value})
                  }
                }}
              >
                <option value="">Select position</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={editingCandidate ? editingCandidate.class : newCandidate.class}
                onChange={(e) => {
                  if (editingCandidate) {
                    setEditingCandidate({...editingCandidate, class: e.target.value})
                  } else {
                    setNewCandidate({...newCandidate, class: e.target.value})
                  }
                }}
              >
                <option value="">Select class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Voter Category */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Voter Category</label>
              <div className="space-y-4">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={editingCandidate ? editingCandidate.voterCategory.type : newCandidate.voterCategory.type}
                  onChange={(e) => {
                    const type = e.target.value as VoterCategory['type']
                    if (editingCandidate) {
                      setEditingCandidate({
                        ...editingCandidate,
                        voterCategory: { type, values: [] }
                      })
                    } else {
                      setNewCandidate({
                        ...newCandidate,
                        voterCategory: { type, values: [] }
                      })
                    }
                  }}
                >
                  <option value="all">All Voters</option>
                  <option value="year">Specific Year/Level</option>
                  <option value="class">Specific Programme/Class</option>
                  <option value="house">Specific Hall/House</option>
                </select>

                {(editingCandidate?.voterCategory.type !== 'all' || newCandidate.voterCategory.type !== 'all') && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Select {editingCandidate ? editingCandidate.voterCategory.type : newCandidate.voterCategory.type}s:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableOptions(editingCandidate?.voterCategory.type || newCandidate.voterCategory.type).map((option) => (
                        <label key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editingCandidate 
                              ? editingCandidate.voterCategory.values.includes(option)
                              : newCandidate.voterCategory.values.includes(option)
                            }
                            onChange={(e) => handleVoterCategoryChange(
                              editingCandidate?.voterCategory.type || newCandidate.voterCategory.type,
                              option,
                              e.target.checked
                            )}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                value={editingCandidate ? editingCandidate.description : newCandidate.description}
                onChange={(e) => {
                  if (editingCandidate) {
                    setEditingCandidate({...editingCandidate, description: e.target.value})
                  } else {
                    setNewCandidate({...newCandidate, description: e.target.value})
                  }
                }}
                placeholder="Enter candidate description"
              />
            </div>

            {/* Active Status */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active-status"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={editingCandidate ? editingCandidate.active : newCandidate.active}
                  onChange={(e) => {
                    if (editingCandidate) {
                      setEditingCandidate({...editingCandidate, active: e.target.checked})
                    } else {
                      setNewCandidate({...newCandidate, active: e.target.checked})
                    }
                  }}
                />
                <label htmlFor="active-status" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Only active candidates will be available for voting.
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingCandidate(null)
                setSelectedFile(null)
                setPreviewUrl('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={editingCandidate ? handleUpdateCandidate : handleAddCandidate}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingCandidate ? 'Update' : 'Add'} Candidate
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
              All Candidates
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
              title="Print candidate list"
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
                title="Select columns" >
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
                          checked={visibleColumns.position}
                          onChange={() => setVisibleColumns({...visibleColumns, position: !visibleColumns.position})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Position</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={visibleColumns.class}
                          onChange={() => setVisibleColumns({...visibleColumns, class: !visibleColumns.class})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Class</span>
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
                          checked={visibleColumns.voterCategory}
                          onChange={() => setVisibleColumns({...visibleColumns, voterCategory: !visibleColumns.voterCategory})}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Voter Category</span>
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
        
        {/* Search and Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="">All Positions</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
          
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Table */}
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
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                          <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.position && (
                  <th 
                    scope="col" 
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('position')}
                  >
                    <div className="flex items-center">
                      Position
                      {sortField === 'position' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                          <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.class && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                )}
                {visibleColumns.description && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                )}
                {visibleColumns.voterCategory && (
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voter Category
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
              {filteredCandidates.map((candidate, index) => (
                <tr key={candidate.id} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  {visibleColumns.name && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={candidate.imageUrl} 
                          alt={candidate.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.position && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.position}</div>
                    </td>
                  )}
                  {visibleColumns.class && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.class}</div>
                    </td>
                  )}
                  {visibleColumns.description && (
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-500 max-w-md">{candidate.description}</div>
                    </td>
                  )}
                  {visibleColumns.voterCategory && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 text-indigo-500 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getVoterCategoryLabel(candidate.voterCategory)}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.status && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        candidate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {candidate.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleMovePosition(candidate.id, 'up')}
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
                          onClick={() => handleMovePosition(candidate.id, 'down')}
                          disabled={index === filteredCandidates.length - 1}
                          className={`p-1.5 rounded-md ${
                            index === filteredCandidates.length - 1
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100'
                          } transition-colors duration-200`}
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(candidate.id)}
                          className={`p-1.5 rounded-md ${
                            candidate.active 
                              ? 'text-red-600 hover:text-red-900 hover:bg-red-100' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-100'
                          } transition-colors duration-200`}
                          title={candidate.active ? 'Deactivate' : 'Activate'}
                        >
                          {candidate.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => setEditingCandidate(candidate)}
                          className="p-1.5 rounded-md text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 transition-colors duration-200"
                          title="Edit candidate"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCandidate(candidate.id)}
                          className="p-1.5 rounded-md text-red-600 hover:text-red-900 hover:bg-red-100 transition-colors duration-200"
                          title="Delete candidate"
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
        
        {filteredCandidates.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No candidates found matching your search criteria.
          </div>
        )}
        
        {/* Status bar with table information */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1.5 text-gray-400" />
            <span>
              Showing <span className="font-medium text-gray-900">{filteredCandidates.length}</span> of <span className="font-medium text-gray-900">{candidates.length}</span> candidates
              {filterActive !== null && (
                <span> • {filterActive ? 'Active' : 'Inactive'} filter applied</span>
              )}
              {filterPosition && (
                <span> • Position: {filterPosition}</span>
              )}
              {filterClass && (
                <span> • Class: {filterClass}</span>
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
                setFilterPosition('')
                setFilterClass('')
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

export default CandidatesManager