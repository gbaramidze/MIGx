import React, { useState } from 'react';
import Login from './components/Login';
import ParticipantsList from './components/ParticipantsList';
import MetricsDashboard from './components/MetricsDashboard';
import AddParticipantForm from './components/AddParticipantForm';
import { clearAuthToken } from './services/api';
import {useAuth} from "./hooks";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'participants' | 'add'>('metrics');
  const {logout, isAuthenticated} = useAuth()


  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">
                    Clinical Trial Dashboard
                  </h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <button
                      onClick={() => setActiveTab('metrics')}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          activeTab === 'metrics'
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Metrics
                  </button>
                  <button
                      onClick={() => setActiveTab('participants')}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          activeTab === 'participants'
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Participants
                  </button>
                  <button
                      onClick={() => setActiveTab('add')}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          activeTab === 'add'
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    Add Participant
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <button
                    onClick={handleLogout}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {activeTab === 'metrics' && <MetricsDashboard />}
            {activeTab === 'participants' && <ParticipantsList />}
            {activeTab === 'add' && (
                <AddParticipantForm onParticipantAdded={() => setActiveTab('participants')} />
            )}
          </div>
        </main>
      </div>
  );
};

export default App;