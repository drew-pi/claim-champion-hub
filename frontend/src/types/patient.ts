// Patient Portal Form Data Types
export interface PatientInformation {
  fullName: string;
  dateOfBirth: string;
  mailingAddress: string;
  phoneNumber: string;
  emailAddress: string;
  relationshipToPatient: string;
}

export interface InsuranceInformation {
  insuranceCompany: string;
  employerName: string;
  planName: string;
  policyNumber: string;
  memberID: string;
  claimCaseNumber: string;
}

export interface DenialInformation {
  deniedService: string;
  denialDate: string;
  denialReason: string;
  serviceDate: string;
}

export interface MedicalInformation {
  primaryDiagnosis: string;
  referringDoctorName: string;
  doctorSpecialty: string;
  alternativeTreatments: string;
}

export interface DocumentUpload {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface PatientStory {
  medicalNecessity: string;
  impactOnLife: string;
}

export interface ComprehensiveClaimData {
  patientInfo: PatientInformation;
  insuranceInfo: InsuranceInformation;
  denialInfo?: DenialInformation; // Optional for non-denial claims
  medicalInfo: MedicalInformation;
  documents: DocumentUpload[];
  story: PatientStory;
  isDenialClaim: boolean; // Flag to indicate if this is a denial/refuting payment claim
}

// Legacy interface for backward compatibility
export interface ClaimFormData {
  policyNumber: string;
  employerName: string;
  employerAddress: string;
  healthcareProviderName: string;
  healthcareProviderAddress: string;
  claimDescription: string;
  claimAmount: string;
  claimDate: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientPhone: string;
}