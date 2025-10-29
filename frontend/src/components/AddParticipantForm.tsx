import React, { useState } from 'react';
import { useParticipants } from '../hooks/useParticipants';

interface AddParticipantFormProps {
  onParticipantAdded: () => void;
}

const AddParticipantForm: React.FC<AddParticipantFormProps> = ({ onParticipantAdded }) => {
  const { addParticipant } = useParticipants();

  const [formData, setFormData] = useState({
    subject_id: '',
    study_group: 'treatment' as 'treatment' | 'control',
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'completed' | 'withdrawn',
    age: 30,
    gender: 'M' as 'M' | 'F' | 'Other'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await addParticipant(formData);
      if (success) {
        setFormData({
          subject_id: '',
          study_group: 'treatment',
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'active',
          age: 30,
          gender: 'M'
        });
        onParticipantAdded();
      } else {
        setError('Failed to create participant');
      }
    } catch (err) {
      setError('Failed to create participant');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };

  return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Add New Participant
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700">
                  Subject ID
                </label>
                <input
                    type="text"
                    name="subject_id"
                    id="subject_id"
                    required
                    value={formData.subject_id}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                    type="number"
                    name="age"
                    id="age"
                    required
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="study_group" className="block text-sm font-medium text-gray-700">
                  Study Group
                </label>
                <select
                    name="study_group"
                    id="study_group"
                    value={formData.study_group}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="treatment">Treatment</option>
                  <option value="control">Control</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="enrollment_date" className="block text-sm font-medium text-gray-700">
                Enrollment Date
              </label>
              <input
                  type="date"
                  name="enrollment_date"
                  id="enrollment_date"
                  required
                  value={formData.enrollment_date}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Participant'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default AddParticipantForm;