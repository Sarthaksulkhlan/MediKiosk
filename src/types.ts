export type UserRole = 'patient' | 'doctor' | 'staff' | 'kiosk';

export type AppView = 'landing' | 'auth' | 'patient-dashboard' | 'doctor-dashboard' | 'kiosk-mode';

export interface VitalSign {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'elevated' | 'critical' | 'low';
}

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'prescription' | 'lab' | 'imaging' | 'vitals';
  date: string;
  status: string;
  summary: string;
  details?: {
    testName?: string;
    resultValue?: string;
    referenceRange?: string;
    doctor?: string;
    notes?: string;
  };
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  patientId: string;
  avatar?: string;
  chiefComplaint: string;
  language: string;
  languageCode: 'EN' | 'HI';
  vitalsStatus: string;
  isVitalsAlert?: boolean;
  alertType?: 'BP High' | 'Fever High' | 'Tachycardia' | 'Normal';
  waitTime: string;
  aiSummary: {
    status: 'Draft - Review Required' | 'Verified' | 'Signed';
    text: string;
    lastUpdated: string;
  };
  hpi: {
    onset: string;
    severity: string;
    associated: string;
    alleviating: string;
    rawNarrative?: string;
  };
  pmh: string[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  allergies: {
    allergen: string;
    reaction: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
  }[];
  clinicalNotes: string;
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSaturation: string;
    recordedAt: string;
  };
  documents: MedicalDocument[];
}

export interface IntakeSubmission {
  narrative: string;
  language: string;
  chiefComplaint: string;
  duration: string;
  painScale: number;
  associatedSymptoms: string[];
  medications: string;
  allergies: string;
}
