import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Users, Calendar, Settings, LogOut, 
  BarChart2, ChevronDown, Menu, X, Bell, User as UserIcon,
  Briefcase, GraduationCap, Home, ClipboardList, BookOpen,
  School, Shield, Eye, Clock
} from 'lucide-react'
import { useUser } from '../context/UserContext'
import Dashboard from './manager/Dashboard'
import CandidatesManager from './manager/CandidatesManager'
import VotersManager from './manager/VotersManager'
import ElectionSettings from './manager/ElectionSettings'
import Results from './manager/Results'
import DetailedVoteAnalysis from './manager/DetailedVoteAnalysis'
import PositionsManager from './manager/PositionsManager'
import YearManager from './manager/YearManager'
import ClassManager from './manager/ClassManager'
import HouseManager from './manager/HouseManager'
import ActivityLogManager from './manager/ActivityLogManager'
import RolePermissionsManager from './manager/RolePermissionsManager'

const ElectionManager: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const profileMenuRef = useRef(null)
  const [electionStatus, setElectionStatus] = useState<'not-started' | 'active' | 'ended'>('not-started')
  const [timeRemaining, setTimeRemaining] = useState('')
  const [settings, setSettings] = useState({
    schoolName: 'Peki Senior High School',
    schoolLogo: null
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  const isActive = (path: string) => {
    return location.pathname === `/election-manager${path}` ? 
      'bg-indigo-800 text-white' : 
      'text-indigo-100 hover:bg-indigo-700 hover:text-white'
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-indigo-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-full ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-950">
          <div className="flex items-center">
            <School className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">Smart E-Voting</span>
          </div>
          <button 
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {/* Dashboard */}
            <Link
              to="/election-manager"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('')}`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            {/* Positions */}
            <Link
              to="/election-manager/positions"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/positions')}`}
            >
              <Briefcase className="mr-3 h-5 w-5" />
              Positions
            </Link>
            
            {/* Candidates */}
            <Link
              to="/election-manager/candidates"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/candidates')}`}
            >
              <Users className="mr-3 h-5 w-5" />
              Candidates
            </Link>
            
            {/* Voters */}
            <Link
              to="/election-manager/voters"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/voters')}`}
            >
              <Users className="mr-3 h-5 w-5" />
              Voters
            </Link>
            
            {/* Year/Level */}
            <Link
              to="/election-manager/year"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/year')}`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Year/Level
            </Link>
            
            {/* Programme/Class */}
            <Link
              to="/election-manager/class"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/class')}`}
            >
              <GraduationCap className="mr-3 h-5 w-5" />
              Programme/Class
            </Link>
            
            {/* Hall/House */}
            <Link
              to="/election-manager/house"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/house')}`}
            >
              <Home className="mr-3 h-5 w-5" />
              Hall/House
            </Link>
            
            {/* Results */}
            <Link
              to="/election-manager/results"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/results')}`}
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              Results
            </Link>

            {/* Detailed Vote Analysis */}
            <Link
              to="/election-manager/dva"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/dva')}`}
            >
              <Eye className="mr-3 h-5 w-5" />
              DVA
            </Link>
            
            {/* Log */}
            <Link
              to="/election-manager/log"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/log')}`}
            >
              <ClipboardList className="mr-3 h-5 w-5" />
              Log
            </Link>
            
            {/* Roles & Permissions */}
            <Link
              to="/election-manager/roles"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/roles')}`}
            >
              <Shield className="mr-3 h-5 w-5" />
              Roles & Permissions
            </Link>
            
            {/* Settings */}
            <Link
              to="/election-manager/settings"
              className={`flex items-center px-2 py-2 text-sm rounded-md ${isActive('/settings')}`}
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm text-indigo-100 rounded-md hover:bg-indigo-700 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center">
                {settings.schoolLogo ? (
                  <img src={settings.schoolLogo} alt="School Logo" className="h-8 w-8 object-contain" />
                ) : (
                  <School className="h-8 w-8 text-indigo-600" />
                )}
                <h1 className="text-lg text-gray-900 ml-3">{settings.schoolName}</h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Election Date & Timer */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span className="text-indigo-700 font-bold">Election Date: 15th May, 2025</span>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
                    electionStatus === 'not-started' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : electionStatus === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    <Clock className="h-4 w-4" />
                    <span>{
                      electionStatus === 'not-started'
                        ? `Election starts in: ${timeRemaining}`
                        : electionStatus === 'active'
                          ? `Election ends in: ${timeRemaining}`
                          : 'Election has ended'
                    }</span>
                  </div>
                </div>

                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <span className="ml-2 text-sm text-gray-700 hidden md:block">
                      {user.username}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/positions" element={<PositionsManager />} />
                <Route path="/candidates" element={<CandidatesManager />} />
                <Route path="/voters" element={<VotersManager />} />
                <Route path="/year" element={<YearManager />} />
                <Route path="/class" element={<ClassManager />} />
                <Route path="/house" element={<HouseManager />} />
                <Route path="/results" element={<Results />} />
                <Route path="/dva" element={<DetailedVoteAnalysis />} />
                <Route path="/log" element={<ActivityLogManager />} />
                <Route path="/roles" element={<RolePermissionsManager />} />
                <Route path="/settings" element={<ElectionSettings />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ElectionManager