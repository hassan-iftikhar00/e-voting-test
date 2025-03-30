import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { AlertCircle, Check, X, ChevronRight, Search } from 'lucide-react'

interface VoterCategory {
  type: 'all' | 'year' | 'class' | 'house'
  values: string[]
}

interface Candidate {
  _id: string
  name: string
  imageUrl: string
  position: string
  voterCategory: VoterCategory
}

const Candidates: React.FC = () => {
  const location = useLocation()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, Candidate | null>>({})
  const [noneSelected, setNoneSelected] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')
  const [unselectedPositions, setUnselectedPositions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const { user } = useUser()
  const topRef = useRef<HTMLDivElement>(null)

  // Mock voter data - in a real app this would come from your auth system
  const mockVoterData = {
    year: '2025',
    class: 'Form 3A',
    house: 'Red House'
  }

  const mockCandidates = [
    {
      _id: '1',
      name: 'John Mensah',
      position: 'Senior Prefect',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      voterCategory: { type: 'all', values: [] }
    },
    {
      _id: '2',
      name: 'Abena Osei',
      position: 'Senior Prefect',
      imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      voterCategory: { type: 'class', values: ['Form 3A', 'Form 3B'] }
    },
    {
      _id: '3',
      name: 'Kofi Adu',
      position: 'Senior Prefect',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      voterCategory: { type: 'house', values: ['Red House', 'Blue House'] }
    },
    {
      _id: '4',
      name: 'Ama Serwaa',
      position: 'Senior Prefect',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      voterCategory: { type: 'year', values: ['2025'] }
    },
    {
      _id: '6',
      name: 'Akosua Manu',
      position: 'Dining Hall Prefect',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
      voterCategory: { type: 'all', values: [] }
    },
    {
      _id: '7',
      name: 'Emmanuel Owusu',
      position: 'Dining Hall Prefect',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      voterCategory: { type: 'class', values: ['Form 3A'] }
    },
    {
      _id: '8',
      name: 'Gifty Ansah',
      position: 'Sports Prefect',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      voterCategory: { type: 'house', values: ['Red House'] }
    },
    {
      _id: '9',
      name: 'Daniel Asare',
      position: 'Sports Prefect',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      voterCategory: { type: 'all', values: [] }
    }
  ]

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    
    // Filter candidates based on voter category
    const filteredCandidates = mockCandidates.filter(candidate => {
      // If candidate is available to all voters
      if (candidate.voterCategory.type === 'all') return true

      // Check if voter matches the candidate's category restrictions
      switch (candidate.voterCategory.type) {
        case 'year':
          return candidate.voterCategory.values.includes(mockVoterData.year)
        case 'class':
          return candidate.voterCategory.values.includes(mockVoterData.class)
        case 'house':
          return candidate.voterCategory.values.includes(mockVoterData.house)
        default:
          return false
      }
    })
    
    setCandidates(filteredCandidates)
    
    window.scrollTo(0, 0)
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'instant' })
    }
    
    if (location.state) {
      const { selectedCandidates: prevSelected, noneSelected: prevNoneSelected } = 
        location.state as { selectedCandidates: Record<string, Candidate>, noneSelected: Record<string, boolean> }
      
      if (prevSelected) {
        setSelectedCandidates(prevSelected)
      }
      
      if (prevNoneSelected) {
        setNoneSelected(prevNoneSelected)
      }
    }
  }, [user, navigate, location.state])

  useEffect(() => {
    const positions = [...new Set(candidates.map(c => c.position))]
    const unselected = positions.filter(position => 
      selectedCandidates[position] === undefined && !noneSelected[position]
    )
    setUnselectedPositions(unselected)
  }, [selectedCandidates, noneSelected, candidates])

  const handleVote = (candidate: Candidate) => {
    if (noneSelected[candidate.position]) {
      setNoneSelected(prev => ({
        ...prev,
        [candidate.position]: false
      }))
    }
    
    setSelectedCandidates(prev => ({
      ...prev,
      [candidate.position]: candidate
    }))
    setError('')
  }

  const handleNoneSelected = (position: string) => {
    setNoneSelected(prev => ({
      ...prev,
      [position]: true
    }))
    
    setSelectedCandidates(prev => ({
      ...prev,
      [position]: null
    }))
    setError('')
  }

  const handleConfirmVote = () => {
    const positions = [...new Set(candidates.map(c => c.position))]
    const allPositionsSelected = positions.every(position => 
      selectedCandidates[position] !== undefined || noneSelected[position]
    )

    if (allPositionsSelected) {
      const validSelectedCandidates = Object.entries(selectedCandidates)
        .filter(([_, candidate]) => candidate !== null)
        .reduce((acc, [position, candidate]) => {
          acc[position] = candidate!;
          return acc;
        }, {} as Record<string, Candidate>);
        
      navigate('/confirm-vote', { 
        state: { 
          selectedCandidates: validSelectedCandidates,
          noneSelected
        } 
      })
    } else {
      setError(`Please make a selection for each position: ${unselectedPositions.join(', ')}`)
    }
  }

  const filteredCandidates = searchTerm 
    ? candidates.filter(candidate => 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : candidates

  const groupedCandidates = filteredCandidates.reduce((acc, candidate) => {
    if (!acc[candidate.position]) {
      acc[candidate.position] = []
    }
    acc[candidate.position].push(candidate)
    return acc
  }, {} as Record<string, Candidate[]>)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-indigo-50 relative" ref={topRef}>
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-indigo-800 text-white py-3 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-sans tracking-wide">Student Council Election 2025</h1>
          <p className="text-indigo-100 text-sm font-sans font-light">Select your preferred candidate for each position</p>
        </div>
      </div>

      {/* Beautiful Watermark Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated gradient circles */}
        <div className="absolute inset-0 opacity-[0.06]">
          {Array.from({ length: 20 }).map((_, i) => {
            const size = Math.random() * 300 + 100;
            return (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  background: `radial-gradient(circle, ${
                    i % 2 === 0 ? '#4338ca' : '#6366f1'
                  } 0%, transparent 70%)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '3s',
                }}
              />
            );
          })}
        </div>

        {/* Sacred geometry pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sacred-geometry" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#4338ca" strokeWidth="0.5"/>
                <circle cx="50" cy="50" r="30" fill="none" stroke="#4338ca" strokeWidth="0.5"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="#4338ca" strokeWidth="0.5"/>
                <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="#4338ca" strokeWidth="0.5"/>
                <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="#4338ca" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sacred-geometry)"/>
          </svg>
        </div>

        {/* Floating text elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <div className="absolute w-[200%] h-[200%] -rotate-12">
            <div className="absolute top-0 left-0 w-full h-full flex flex-wrap gap-16">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="text-indigo-900 text-9xl font-black whitespace-nowrap transform rotate-12">
                  CHOOSE WISELY
                </div>
              ))}
            </div>
          </div>
          <div className="absolute w-[200%] h-[200%] rotate-12">
            <div className="absolute top-0 left-0 w-full h-full flex flex-wrap gap-16">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="text-indigo-900 text-8xl font-black whitespace-nowrap transform -rotate-12">
                  YOUR VOICE MATTERS
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sticky top-20 z-50">
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates by name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-full border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-300 shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-500" />
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {Object.entries(groupedCandidates).map(([position, positionCandidates]) => {
            const isSelected = selectedCandidates[position] !== undefined || noneSelected[position];
            
            return (
              <div key={position} className={`mb-6 p-6 rounded-xl ${
                isSelected ? 'bg-white shadow-md border-l-4 border-l-yellow-500' : 'bg-white shadow-sm'
              } transition-all duration-10`}>
                <h2 className="text-2xl font-extrabold text-indigo-800 mb-4 font-sans tracking-wide text-left border-b border-indigo-100 pb-2">{position}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {positionCandidates.map((candidate) => (
                    <div
                      key={candidate._id}
                      className={`bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                        noneSelected[position] ? 'opacity-60 shadow' : 
                        selectedCandidates[position]?._id === candidate._id ? 'ring-2 ring-indigo-500 shadow-lg' : 'shadow hover:shadow-md'
                      }`}
                      onClick={() => handleVote(candidate)}
                    >
                      <div className="relative">
                        <img 
                          src={candidate.imageUrl} 
                          alt={candidate.name} 
                          className="w-full h-40 object-cover" 
                        />
                        {selectedCandidates[position]?._id === candidate._id && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full shadow-md">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-base font-bold mb-2 text-gray-800 font-sans">{candidate.name}</h3>
                        <button
                          className={`w-full py-1.5 px-2 rounded-md font-medium transition-colors duration-200 ${
                            selectedCandidates[position]?._id === candidate._id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
                          } font-sans text-sm`}
                        >
                          {selectedCandidates[position]?._id === candidate._id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div
                    className={`bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      noneSelected[position] ? 'ring-2 ring-red-700 shadow-lg' : 'shadow hover:shadow-md'
                    }`}
                    onClick={() => handleNoneSelected(position)}
                  >
                    <div className="relative h-40 bg-red-100 flex items-center justify-center">
                      <img 
                        src="https://cdn-icons-png.flaticon.com/512/6711/6711656.png" 
                        alt="None of the listed" 
                        className={`h-20 w-20 ${noneSelected[position] ? 'opacity-100' : 'opacity-70'}`} 
                      />
                      {noneSelected[position] && (
                        <div className="absolute top-2 right-2 bg-red-700 text-white p-1 rounded-full shadow-md">
                          <X className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-base font-bold mb-2 text-red-800">None of the listed</h3>
                      <button
                        className={`w-full py-1.5 px-2 rounded-md font-medium transition-colors duration-200 ${
                          noneSelected[position]
                            ? 'bg-red-700 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                        } font-sans text-sm`}
                      >
                        {noneSelected[position] ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 border-l-4 border-red-700 shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 font-sans">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={handleConfirmVote}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 font-sans tracking-wide flex items-center mx-auto"
            >
              Review & Confirm Selections
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Candidates