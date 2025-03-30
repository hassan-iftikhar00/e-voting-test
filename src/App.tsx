import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import VotingAuth from './components/VotingAuth'
import Candidates from './components/Candidates'
import ConfirmVote from './components/ConfirmVote'
import ThankYou from './components/ThankYou'
import ElectionManager from './components/ElectionManager'
import { UserProvider } from './context/UserContext'
import { SettingsProvider } from './context/SettingsContext'
import { ElectionProvider } from './context/ElectionContext'

function App() {
  return (
    <UserProvider>
      <SettingsProvider>
        <ElectionProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Navigate to="/voting-auth" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/voting-auth" element={<VotingAuth />} />
                  <Route path="/candidates" element={<Candidates />} />
                  <Route path="/confirm-vote" element={<ConfirmVote />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="/election-manager/*" element={<ElectionManager />} />
                </Routes>
              </main>
            </div>
          </Router>
        </ElectionProvider>
      </SettingsProvider>
    </UserProvider>
  )
}

export default App