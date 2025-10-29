import React from 'react';
import { useMetrics } from '../hooks/useMetrics';
import LoadingSpinner from './LoadingSpinner';

const MetricsDashboard: React.FC = () => {
  const { metrics, loading, error, refreshMetrics } = useMetrics();

  if (loading) {
    return <LoadingSpinner text="Loading metrics..." />;
  }

  if (error) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
                onClick={refreshMetrics}
                className="bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
    );
  }

  if (!metrics) {
    return <div>No metrics data available</div>;
  }

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trial Metrics</h2>
          <button
              onClick={refreshMetrics}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Refresh Metrics
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Participants
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {metrics.total_participants}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Active Participants
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {metrics.active_participants}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Completed Studies
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">
                {metrics.completed_studies}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Treatment Group
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-purple-600">
                {metrics.treatment_group}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Control Group
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-orange-600">
                {metrics.control_group}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Average Age
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {metrics.average_age}
              </dd>
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.gender_distribution.M}</div>
                <div className="text-sm text-gray-500">Male</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{metrics.gender_distribution.F}</div>
                <div className="text-sm text-gray-500">Female</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.gender_distribution.Other}</div>
                <div className="text-sm text-gray-500">Other</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MetricsDashboard;