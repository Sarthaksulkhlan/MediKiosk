export type PatientTab =
  | 'dashboard'
  | 'profile'
  | 'registration'
  | 'consent'
  | 'language'
  | 'healthcare-system'
  | 'ai-interview'
  | 'red-flags'
  | 'reports'
  | 'doctor-advice'
  | 'review'
  | 'submit'
  | 'settings'
  | 'help';

export interface PatientProfileData {
  name: string;
  age: number;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  abhaId: string;
  abhaAddress: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  insurance: {
    provider: string;
    policyNumber: string;
    validity: string;
  };
  preferredLanguage: string;
  healthcareApproach: 'allopathy' | 'ayush' | 'integrated';
  assignedDoctor: {
    name: string;
    specialty: string;
    room: string;
    slot: string;
    tokenNumber: string;
  };
}

export interface UploadedReport {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'JPG' | 'PNG';
  category: 'Prescription' | 'Lab Report' | 'Scan / Imaging' | 'Discharge Summary';
  uploadedAt: string;
  size: string;
  status: 'Processed' | 'Analyzing' | 'Verified';
  extractedData?: {
    testName?: string;
    doctor?: string;
    date?: string;
    parameters?: { name: string; value: string; range: string; status: 'normal' | 'elevated' | 'critical' }[];
    medicines?: { name: string; dosage: string; frequency: string }[];
    summary: string;
  };
}

export interface ConsentSettings {
  personalInfo: boolean;
  medicalInfo: boolean;
  reportsData: boolean;
  aiProcessing: boolean;
  emergencySharing: boolean;
  signedAt?: string;
  signatureHash?: string;
}

export interface RiskItem {
  id: string;
  symptom: string;
  severity: 'Low' | 'Moderate' | 'High Priority';
  category: string;
  recommendation: string;
  actionRequired: string;
}
