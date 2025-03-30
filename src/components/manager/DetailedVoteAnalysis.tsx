import React, { useState } from 'react'
import { 
  Search, Download, FileSpreadsheet, Printer,
  Users, Calendar, Clock, Filter, X
} from 'lucide-react'

// Mock data
const mockVoterData = [
  { 
    id: '1', 
    name: 'John Doe', 
    voterId: 'VOTER2025', 
    class: 'Form 3A',
    votedAt: new Date('2025-05-15T08:00:00'),
    votedFor: {
      'Senior Prefect': 'John Mensah',
      'Dining Hall Prefect': 'Kwame Boateng',
      'Sports Prefect': 'Gifty Ansah'
    }
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    voterId: 'VOTER2024', 
    class: 'Form 3B',
    votedAt: new Date('2025-05-15T08:15:00'),
    votedFor: {
      'Senior Prefect': 'Abena Osei',
      'Dining Hall Prefect': 'Akosua Manu',
      'Sports Prefect': 'Daniel Asare'
    }
  }
]

interface VoterData {
  id: string
  name: string
  voterId: string
  class: string
  votedAt: Date
  votedFor: Record<string, string>
}

const DetailedVoteAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterPosition, setFilterPosition] = useState('')
  const [filterCandidate, setFilterCandidate] = useState('')

  // Get unique classes and positions for filters
  const classes = Array.from(new Set(mockVoterData.map(voter => voter.class)))
  const positions = Array.from(new Set(mockVoterData.flatMap(voter => Object.keys(voter.votedFor))))
  const candidates = Array.from(new Set(mockVoterData.flatMap(voter => Object.values(voter.votedFor))))

  // Filter voter data
  const filteredVoters = mockVoterData.filter(voter => {
    const matchesSearch = 
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.voterId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesClass = !filterClass || voter.class === filterClass
    const matchesPosition = !filterPosition || Object.keys(voter.votedFor).includes(filterPosition)
    const matchesCandidate = !filterCandidate || Object.values(voter.votedFor).includes(filterCandidate)
    
    return matchesSearch && matchesClass && matchesPosition && matchesCandidate
  })

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

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
        .voter-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 20px;
          padding: 16px;
        }
        .voter-info {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .voter-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e7eb;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .voter-details {
          flex-grow: 1;
        }
        .voter-name {
          font-weight: 600;
          color: #111827;
        }
        .voter-id {
          color: #6b7280;
          font-size: 14px;
        }
        .votes-cast {
          margin-top: 8px;
          padding-left: 52px;
        }
        .vote-item {
          margin-bottom: 4px;
          color: #374151;
        }
        .vote-position {
          color: #6b7280;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
      </style>
    `
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Detailed Vote Analysis</title>
          ${styles}
        </head>
        <body>
          <h1>Student Council Election 2025</h1>
          <h1>Detailed Vote Analysis</h1>
          
          ${filteredVoters.map(voter => `
            <div class="voter-card">
              <div class="voter-info">
                <div class="voter-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div class="voter-details">
                  <div class="voter-name">${voter.name}</div>
                  <div class="voter-id">${voter.voterId}</div>
                </div>
                <div class="voter-class">${voter.class}</div>
                <div class="voter-time">${formatDateTime(voter.votedAt)}</div>
              </div>
              <div class="votes-cast">
                ${Object.entries(voter.votedFor).map(([position, candidate]) => `
                  <div class="vote-item">
                    <span class="vote-position">${position}:</span> ${candidate}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>Peki Senior High School - Prefectorial Elections 2025</p>
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 500)
  }

  const handleExportExcel = () => {
    let csvContent = "Voter ID,Name,Class,Date/Time,Position,Voted For\n"
    
    filteredVoters.forEach(voter => {
      Object.entries(voter.votedFor).forEach(([position, candidate]) => {
        csvContent += `${voter.voterId},"${voter.name}","${voter.class}","${formatDateTime(voter.votedAt)}","${position}","${candidate}"\n`
      })
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `detailed_vote_analysis_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Detailed Vote Analysis</h2>
        <p className="text-indigo-100 text-sm">Analyze individual voting patterns and results</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or voter ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filter selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="">All Positions</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>

          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={filterCandidate}
            onChange={(e) => setFilterCandidate(e.target.value)}
          >
            <option value="">All Candidates</option>
            {candidates.map(candidate => (
              <option key={candidate} value={candidate}>{candidate}</option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Votes Cast
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVoters.map(voter => (
                <tr key={voter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-full">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                        <div className="text-sm text-gray-500">{voter.voterId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{voter.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDateTime(voter.votedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {Object.entries(voter.votedFor).map(([position, candidate]) => (
                        <div key={position} className="text-sm">
                          <span className="text-gray-500">{position}:</span>{' '}
                          <span className="text-gray-900 font-medium">{candidate}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVoters.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No results found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailedVoteAnalysis