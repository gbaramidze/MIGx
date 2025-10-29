export interface Participant {
  participant_id: string;
  subject_id: string;
  study_group: 'treatment' | 'control';
  enrollment_date: string;
  status: 'active' | 'completed' | 'withdrawn';
  age: number;
  gender: 'M' | 'F' | 'Other';
}

export interface Metrics {
  total_participants: number;
  active_participants: number;
  completed_studies: number;
  treatment_group: number;
  control_group: number;
  average_age: number;
  gender_distribution: {
    M: number;
    F: number;
    Other: number;
  };
}

export interface User {
  username: string;
  email: string;
}