import { useState, useEffect, useCallback } from 'react';
import { Participant } from '../types';
import { participantsAPI } from '../services/api';

interface UseParticipantsReturn {
  participants: Participant[];
  loading: boolean;
  error: string | null;
  refreshParticipants: () => Promise<void>;
  addParticipant: (participant: Omit<Participant, 'participant_id'>) => Promise<boolean>;
  updateParticipant: (id: string, participant: Partial<Participant>) => Promise<boolean>;
  deleteParticipant: (id: string) => Promise<boolean>;
}

export const useParticipants = (): UseParticipantsReturn => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadParticipants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await participantsAPI.getParticipants();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading participants:', err);
      setError('Failed to load participants');
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addParticipant = useCallback(async (
      participantData: Omit<Participant, 'participant_id'>
  ): Promise<boolean> => {
    try {
      setError(null);
      const newParticipant = await participantsAPI.createParticipant(participantData);
      setParticipants(prev => [...prev, newParticipant]);
      return true;
    } catch (err) {
      console.error('Error adding participant:', err);
      setError('Failed to add participant');
      return false;
    }
  }, []);

  const updateParticipant = useCallback(async (
      id: string,
      participantData: Partial<Participant>
  ): Promise<boolean> => {
    try {
      setError(null);
      const updatedParticipant = await participantsAPI.updateParticipant(id, participantData);
      setParticipants(prev =>
          prev.map(p => p.participant_id === id ? updatedParticipant : p)
      );
      return true;
    } catch (err) {
      console.error('Error updating participant:', err);
      setError('Failed to update participant');
      return false;
    }
  }, []);

  const deleteParticipant = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await participantsAPI.deleteParticipant(id);
      setParticipants(prev => prev.filter(p => p.participant_id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting participant:', err);
      setError('Failed to delete participant');
      return false;
    }
  }, []);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  return {
    participants,
    loading,
    error,
    refreshParticipants: loadParticipants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
  };
};