export type UserRole = 'patient' | 'doctor' | 'staff' | 'kiosk';

export type AppView = 'landing' | 'auth' | 'patient-dashboard' | 'doctor-dashboard' | 'kiosk-mode';

export type DoctorSection =
  | 'patient-queue'
  | 'priority-cases'
  | 'reports'
  | 'ai-summary'
  | 'ayush-assessment'
  | 'doctor-edit'
  | 'patient-report'
  | 'consultation';

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

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  category: 'intake' | 'vitals' | 'consult' | 'lab' | 'rx' | 'history' | 'ayush';
  description: string;
  doctorOrSource?: string;
  status?: string;
  tags?: string[];
}

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface AyushProfile {
  doshaDominance: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic';
  prakritiDetails: string;
  agniAssessment: 'Manda (Sluggish)' | 'Tikshna (Intense)' | 'Visham (Irregular)' | 'Sama (Balanced)';
  dietaryAdvice: string[];
  lifestyleRecommendations: string[];
  herbalSupport: string[];
  physicianIncluded: boolean;
  notes?: string;
}

export type PatientWorkflowStep =
  | 'welcome'
  | 'registration'
  | 'consent'
  | 'language'
  | 'care-preference'
  | 'voice-interview'
  | 'aura-ai'
  | 'red-flags'
  | 'scan-reports'
  | 'review-info'
  | 'submit';

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  patientId: string;
  avatar?: string;
  abhaNumber?: string;
  carePreference?: 'Modern Medicine' | 'AYUSH / Ayurveda';
  consentGiven?: boolean;
  consentTimestamp?: string;
  redFlagsDetected?: string[];
  chiefComplaint: string;
  language: string;
  languageCode: 'EN' | 'HI';
  vitalsStatus: string;
  isVitalsAlert?: boolean;
  alertType?: 'BP High' | 'Fever High' | 'Tachycardia' | 'Normal';
  priorityLevel?: 'Urgent' | 'Elevated' | 'Standard';
  triageReason?: string;
  waitTime: string;
  aiSummary: {
    status: 'Draft - Review Required' | 'Verified' | 'Signed';
    text: string;
    lastUpdated: string;
    differentialConsiderations?: string[];
    redFlags?: string[];
    soap?: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
    };
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
  timeline?: TimelineEvent[];
  ayushProfile?: AyushProfile;
  prescriptions?: PrescriptionItem[];
  confirmedDiagnosis?: string;
  examinationFindings?: string;
  labOrders?: string[];
  followUpDate?: string;
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

