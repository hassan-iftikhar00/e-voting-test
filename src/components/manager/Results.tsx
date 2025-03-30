import React, { useState } from 'react'
import { 
  Search, Download, FileSpreadsheet, Printer,
  Users, Check, AlertCircle, BarChart2,
  X, ChevronRight
} from 'lucide-react'

// Mock data for election results
const mockResults = [
  {
    position: 'Senior Prefect',
    candidates: [
      { 
        id: '1', 
        name: 'John Mensah', 
        votes: 45, 
        percentage: 37.5,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      { 
        id: '2', 
        name: 'Abena Osei', 
        votes: 32, 
        percentage: 26.7,
        imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      { 
        id: '3', 
        name: 'Kofi Adu', 
        votes: 28, 
        percentage: 23.3,
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      { 
        id: '4', 
        name: 'Ama Serwaa', 
        votes: 15, 
        percentage: 12.5,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      }
    ],
    totalVotes: 120
  },
  {
    position: 'Dining Hall Prefect',
    candidates: [
      { 
        id: '5', 
        name: 'Kwame Boateng', 
        votes: 56, 
        percentage: 42.4,
        imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      { 
        id: '6', 
        name: 'Akosua Manu', 
        votes: 42, 
        percentage: 31.8,
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80'
      },
      { 
        id: '7', 
        name: 'Emmanuel Owusu', 
        votes: 34, 
        percentage: 25.8,
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      }
    ],
    totalVotes: 132
  },
  {
    position: 'Sports Prefect',
    candidates: [
      { 
        id: '8', 
        name: 'Gifty Ansah', 
        votes: 67, 
        percentage: 55.8,
        imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      { 
        id: '9', 
        name: 'Daniel Asare', 
        votes: 53, 
        percentage: 44.2,
        imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      }
    ],
    totalVotes: 120
  }
]

interface Candidate {
  id: string
  name: string
  votes: number
  percentage: number
  imageUrl: string
}

interface Result {
  position: string
  candidates: Candidate[]
  totalVotes: number
}

const Results: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)

  // Filter results
  const filteredResults = mockResults.filter(result =>
    result.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.candidates.some(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

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
        .position-card { 
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 20px;
          padding: 16px;
          page-break-inside: avoid;
        }
        .position-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 12px;
        }
        .candidate {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px;
          background: #f9fafb;
          border-radius: 6px;
        }
        .candidate-image {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 12px;
          object-fit: cover;
        }
        .candidate-info {
          flex-grow: 1;
        }
        .candidate-name {
          font-weight: 600;
          color: #111827;
        }
        .candidate-votes {
          color: #6b7280;
          font-size: 14px;
        }
        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-top: 8px;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
        }
        .total-votes {
          text-align: right;
          color: #6b7280;
          font-size: 14px;
          margin-top: 8px;
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
          <title>Student Council Election 2025 - Results</title>
          ${styles}
        </head>
        <body>
          <h1>Student Council Election 2025</h1>
          <h1>Peki Senior High School - Election Results</h1>
          
          ${filteredResults.map(result => `
            <div class="position-card">
              <div class="position-title">${result.position}</div>
              ${result.candidates
                .sort((a, b) => b.votes - a.votes)
                .map(candidate => `
                  <div class="candidate">
                    <img src="${candidate.imageUrl}" alt="${candidate.name}" class="candidate-image">
                    <div class="candidate-info">
                      <div class="candidate-name">${candidate.name}</div>
                      <div class="candidate-votes">${candidate.votes} votes (${candidate.percentage}%)</div>
                      <div class="progress-bar">
                        <div 
                          class="progress-fill" 
                          style="width: ${candidate.percentage}%; background-color: ${
                            candidate.percentage >= 50 ? '#059669' :
                            candidate.percentage >= 30 ? '#0284c7' :
                            '#6366f1'
                          };"
                        ></div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              <div class="total-votes">Total Votes: ${result.totalVotes}</div>
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
    
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  const handleExportExcel = () => {
    let csvContent = "Position,Candidate,Votes,Percentage\n"
    
    filteredResults.forEach(result => {
      result.candidates.forEach(candidate => {
        csvContent += `"${result.position}","${candidate.name}",${candidate.votes},${candidate.percentage}%\n`
      })
      csvContent += `"${result.position} Total",,${result.totalVotes},100%\n\n`
    })
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `election_results_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-4 rounded-lg shadow-md">
        <div>
          <h2 className="text-xl font-bold">Election Results</h2>
          <p className="text-indigo-100 text-sm font-sans font-light">View and analyze voting results</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search positions or candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((result) => (
          <div key={result.position} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{result.position}</h3>
              <p className="text-sm text-gray-500">Total Votes: {result.totalVotes}</p>
            </div>
            
            <div className="p-4 space-y-4">
              {result.candidates
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => (
                  <div key={candidate.id} className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={candidate.imageUrl} 
                          alt={candidate.name}
                          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm" 
                        />
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs shadow-sm">
                            1
                          </div>
                        )}
                        {index === 1 && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs shadow-sm">
                            2
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-900">{candidate.name}</span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-indigo-600">{candidate.votes}</span>
                            <span className="text-xs text-gray-500 ml-1">({candidate.percentage}%)</span>
                          </div>
                        </div>
                        <div className="relative mt-2">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                            <div
                              style={{ width: `${candidate.percentage}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                index === 0 ? 'bg-green-500' :
                                index === 1 ? 'bg-yellow-500' :
                                'bg-indigo-500'
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="bg-white p-8 text-center rounded-lg shadow-md">
          <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms
          </p>
        </div>
      )}
    </div>
  )
}

export default Results