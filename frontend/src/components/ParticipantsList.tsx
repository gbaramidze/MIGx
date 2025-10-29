import React, { useState } from 'react';
import { useParticipants } from '../hooks';
import LoadingSpinner from './LoadingSpinner';

const ParticipantsList: React.FC = () => {
  const {
    participants,
    loading,
    error,
    refreshParticipants,
    updateParticipant,
    deleteParticipant
  } = useParticipants();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const handleEdit = (participant: any) => {
    setEditingId(participant.participant_id);
    setEditForm({
      subject_id: participant.subject_id,
      study_group: participant.study_group,
      enrollment_date: participant.enrollment_date,
      status: participant.status,
      age: participant.age,
      gender: participant.gender
    });
  };

  const handleUpdate = async (participantId: string) => {
    const success = await updateParticipant(participantId, editForm);
    if (success) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDelete = async (participantId: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) {
      return;
    }
    await deleteParticipant(participantId);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return <LoadingSpinner text="Loading participants..." />;
  }

  if (error) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
                onClick={refreshParticipants}
                className="bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Participants
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage clinical trial participants
            </p>
          </div>
          <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Total: {participants.length}
          </span>
            <button
                onClick={refreshParticipants}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200">
          {participants.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <div className="text-lg text-gray-500 mb-2">No participants found</div>
                <div className="text-sm text-gray-400">
                  Add participants using the "Add Participant" tab
                </div>
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Study Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant) => (
                      <tr key={participant.participant_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {editingId === participant.participant_id ? (
                              <input
                                  type="text"
                                  value={editForm.subject_id || ''}
                                  onChange={(e) => handleEditChange('subject_id', e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                              />
                          ) : (
                              participant.subject_id
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingId === participant.participant_id ? (
                              <select
                                  value={editForm.study_group || ''}
                                  onChange={(e) => handleEditChange('study_group', e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                              >
                                <option value="treatment">Treatment</option>
                                <option value="control">Control</option>
                              </select>
                          ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  participant.study_group === 'treatment'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                              }`}>
                          {participant.study_group}
                        </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingId === participant.participant_id ? (
                              <select
                                  value={editForm.status || ''}
                                  onChange={(e) => handleEditChange('status', e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                              >
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="withdrawn">Withdrawn</option>
                              </select>
                          ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  participant.status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : participant.status === 'completed'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-red-100 text-red-800'
                              }`}>
                          {participant.status}
                        </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingId === participant.participant_id ? (
                              <input
                                  type="number"
                                  value={editForm.age || ''}
                                  onChange={(e) => handleEditChange('age', parseInt(e.target.value))}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm w-16"
                                  min="18"
                                  max="100"
                              />
                          ) : (
                              participant.age
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editingId === participant.participant_id ? (
                              <select
                                  value={editForm.gender || ''}
                                  onChange={(e) => handleEditChange('gender', e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                              >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="Other">Other</option>
                              </select>
                          ) : (
                              participant.gender
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingId === participant.participant_id ? (
                              <div className="flex space-x-2">
                                <button
                                    onClick={() => handleUpdate(participant.participant_id)}
                                    className="text-green-600 hover:text-green-900 font-medium"
                                >
                                  Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-gray-600 hover:text-gray-900 font-medium"
                                >
                                  Cancel
                                </button>
                              </div>
                          ) : (
                              <div className="flex space-x-3">
                                <button
                                    onClick={() => handleEdit(participant)}
                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(participant.participant_id)}
                                    className="text-red-600 hover:text-red-900 font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
  );
};

export default ParticipantsList;