import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Shield,
  AlertTriangle,
  Stethoscope,
  Upload,
  MessageSquare,
  ArrowLeft,
  Heart,
} from "lucide-react";

import PatientFormSection from "./PatientFormSection";
import FileUpload from "./FileUpload";
import {
  PatientInformation,
  InsuranceInformation,
  DenialInformation,
  MedicalInformation,
  DocumentUpload,
  PatientStory,
  ComprehensiveClaimData,
} from "@/types/patient";
import { stringToUUID } from "@/utils/uuid";

interface PatientPortalProps {
  onBack?: () => void;
}

export default function PatientPortal({ onBack }: PatientPortalProps) {
  const [loading, setLoading] = useState(false);
  const [isDenialClaim, setIsDenialClaim] = useState(false);

  // Section 1: Patient Information
  const [patientInfo, setPatientInfo] = useState<PatientInformation>({
    fullName: "",
    dateOfBirth: "",
    mailingAddress: "",
    phoneNumber: "",
    emailAddress: "",
    relationshipToPatient: "self",
  });

  // Section 2: Insurance Information
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInformation>({
    insuranceCompany: "",
    employerName: "",
    planName: "",
    policyNumber: "",
    memberID: "",
    claimCaseNumber: "",
  });

  // Section 3: Denial Information
  const [denialInfo, setDenialInfo] = useState<DenialInformation>({
    deniedService: "",
    denialDate: "",
    denialReason: "",
    serviceDate: "",
  });

  // Section 4: Medical Information
  const [medicalInfo, setMedicalInfo] = useState<MedicalInformation>({
    primaryDiagnosis: "",
    referringDoctorName: "",
    doctorSpecialty: "",
    alternativeTreatments: "",
  });

  // Section 5: Supporting Documentation
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);

  // Section 6: Patient Story
  const [story, setStory] = useState<PatientStory>({
    medicalNecessity: "",
    impactOnLife: "",
  });

  const updatePatientInfo = (
    field: keyof PatientInformation,
    value: string
  ) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateInsuranceInfo = (
    field: keyof InsuranceInformation,
    value: string
  ) => {
    setInsuranceInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateDenialInfo = (field: keyof DenialInformation, value: string) => {
    setDenialInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateMedicalInfo = (
    field: keyof MedicalInformation,
    value: string
  ) => {
    setMedicalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateStory = (field: keyof PatientStory, value: string) => {
    setStory((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    // Required fields validation
    const requiredFields = [
      { value: patientInfo.fullName, name: "Full Name" },
      { value: patientInfo.emailAddress, name: "Email Address" },
      { value: insuranceInfo.insuranceCompany, name: "Insurance Company" },
      { value: insuranceInfo.policyNumber, name: "Policy Number" },
      { value: medicalInfo.primaryDiagnosis, name: "Primary Diagnosis" },
    ];

    // Add denial-specific fields only if this is a denial claim
    if (isDenialClaim) {
      requiredFields.push(
        { value: denialInfo.deniedService, name: "Denied Service" },
        { value: denialInfo.denialReason, name: "Denial Reason" }
      );
    }

    for (const field of requiredFields) {
      if (!field.value.trim()) {
        toast({
          title: "Required Field Missing",
          description: `Please fill in: ${field.name}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      var profile;

      const userId = stringToUUID(patientInfo.fullName);

      console.log("Generated userId:", userId);

      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id, user_id, email")
        .eq("user_id", userId)
        .maybeSingle();

      if (checkError) {
        throw new Error(
          `Error checking existing profile: ${checkError.message}`
        );
      }

      if (existingProfile) {
        console.log("User already exists with user_id:", existingProfile);
        profile = existingProfile;
      } else {
        console.log("There is no existing profile");

        const { data: newProfile, error: createProfileError } = await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            email: patientInfo.emailAddress,
            first_name: patientInfo.fullName.split(" ")[0],
            last_name: patientInfo.fullName.split(" ").slice(1).join(" "),
            phone: patientInfo.phoneNumber,
            role: "patient",
          })
          .select("id")
          .single();

        if (createProfileError) {
          console.log(createProfileError);

          toast({
            title: "Authentication Error",
            description: "Could not submit claim",
            variant: "destructive",
          });
          return;
        } else {
          profile = newProfile;
        }
      }

      console.log("Comprehensive Claim Data:", {
        patientInfo,
        insuranceInfo,
        denialInfo,
        medicalInfo,
        documents,
        story,
      });

      const safeServiceDate = (() => {
        const parsed = new Date(denialInfo.serviceDate);
        return isNaN(parsed.getTime())
          ? new Date().toISOString().split("T")[0]
          : parsed.toISOString().split("T")[0];
      })();

      console.log(safeServiceDate);

      // 3. Prepare claim data mapping to your schema
      const claimData = {
        patient_id: profile.id,
        policy_number: insuranceInfo.policyNumber,
        claim_number: insuranceInfo.claimCaseNumber || null,
        employer_name: insuranceInfo.employerName,
        employer_address: patientInfo.mailingAddress, // You might want a separate field for this
        healthcare_provider_name: medicalInfo.referringDoctorName,
        healthcare_provider_address: null, // Not captured in your form
        claim_description: `${denialInfo.deniedService} - ${story.medicalNecessity}`,
        claim_amount: null, // Not captured in your form - you might want to add this field
        claim_date: safeServiceDate,
        status: "submitted", // Default status
        priority: "normal", // Default priority
        notes: `Denial Reason: ${denialInfo.denialReason}\nMedical Necessity: ${story.medicalNecessity}\nImpact on Life: ${story.impactOnLife}\nAlternative Treatments: ${medicalInfo.alternativeTreatments}\nDoctor Specialty: ${medicalInfo.doctorSpecialty}`,
      };

      // 4. Insert the claim
      const { data: claim, error: claimError } = await supabase
        .from("claims")
        .insert(claimData)
        .select("id")
        .single();

      if (claimError) {
        throw new Error(`Failed to create claim: ${claimError.message}`);
      }

      // 5. Handle document uploads (if any)
      if (documents.length > 0) {
        const documentPromises = documents.map(async (doc) => {
          // Note: You'll need to implement file upload to Supabase Storage first
          // Then insert document records
          return supabase.from("claim_documents").insert({
            claim_id: claim.id,
            document_name: doc.name,
            document_type: doc.type,
            file_path: `claims/${claim.id}/${doc.name}`, // Placeholder path
            file_size: null,
            uploaded_by: profile.id,
          });
        });

        const documentResults = await Promise.all(documentPromises);

        // Check for document upload errors
        const documentErrors = documentResults.filter((result) => result.error);
        if (documentErrors.length > 0) {
          console.warn("Some documents failed to upload:", documentErrors);
        }
      }

      // 6. Create claim history entry
      await supabase.from("claim_history").insert({
        claim_id: claim.id,
        action: "claim_submitted",
        details: "Initial claim submission by patient",
        performed_by: profile.id,
      });

      console.log("Claim submitted successfully:", {
        claimId: claim.id,
        patientId: profile.id,
        claimData,
      });

      toast({
        title: "Claim Submitted Successfully",
        description: `Your claim has been submitted with ID: ${claim.id.slice(
          0,
          8
        )}...`,
      });

      // Reset form (your existing reset code)
      setPatientInfo({
        fullName: "",
        dateOfBirth: "",
        mailingAddress: "",
        phoneNumber: "",
        emailAddress: "",
        relationshipToPatient: "self",
      });
      setInsuranceInfo({
        insuranceCompany: "",
        employerName: "",
        planName: "",
        policyNumber: "",
        memberID: "",
        claimCaseNumber: "",
      });
      setDenialInfo({
        deniedService: "",
        denialDate: "",
        denialReason: "",
        serviceDate: "",
      });
      setMedicalInfo({
        primaryDiagnosis: "",
        referringDoctorName: "",
        doctorSpecialty: "",
        alternativeTreatments: "",
      });
      setDocuments([]);
      setStory({
        medicalNecessity: "",
        impactOnLife: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Error",
        description:
          error instanceof Error
            ? error.message
            : "There was an error submitting your claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header with Back Button */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-full">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">
                  HealthAdvocate - Patient Portal
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Submit Your Healthcare Claim
            </h1>
            <p className="text-lg text-muted-foreground">
              Provide comprehensive information to help our advocates fight for
              your coverage
            </p>
          </div>

          {/* Claim Type Selection */}
          <div className="mb-6 p-4 bg-card border rounded-lg">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDenialClaim"
                checked={isDenialClaim}
                onChange={(e) => setIsDenialClaim(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isDenialClaim" className="text-sm font-medium">
                This is a denial/refuting payment claim
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Check this box if you're appealing a denied service or disputing a
              payment charge
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Patient Information */}
            <PatientFormSection
              title="Patient Information"
              description="Basic demographic and contact information"
              icon={<User className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={patientInfo.fullName}
                    onChange={(e) =>
                      updatePatientInfo("fullName", e.target.value)
                    }
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={patientInfo.dateOfBirth}
                    onChange={(e) =>
                      updatePatientInfo("dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="mailingAddress">Mailing Address</Label>
                  <Textarea
                    id="mailingAddress"
                    value={patientInfo.mailingAddress}
                    onChange={(e) =>
                      updatePatientInfo("mailingAddress", e.target.value)
                    }
                    placeholder="Enter complete mailing address"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={patientInfo.phoneNumber}
                    onChange={(e) =>
                      updatePatientInfo("phoneNumber", e.target.value)
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address *</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={patientInfo.emailAddress}
                    onChange={(e) =>
                      updatePatientInfo("emailAddress", e.target.value)
                    }
                    placeholder="patient@example.com"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="relationship">Relationship to Patient</Label>
                  <Select
                    value={patientInfo.relationshipToPatient}
                    onValueChange={(value) =>
                      updatePatientInfo("relationshipToPatient", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="legal_guardian">
                        Legal Guardian
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PatientFormSection>

            {/* Section 2: Insurance Information */}
            <PatientFormSection
              title="Insurance Information"
              description="Details about your health insurance plan and coverage"
              icon={<Shield className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceCompany">Insurance Company *</Label>
                  <Input
                    id="insuranceCompany"
                    value={insuranceInfo.insuranceCompany}
                    onChange={(e) =>
                      updateInsuranceInfo("insuranceCompany", e.target.value)
                    }
                    placeholder="e.g., Aetna, Cigna, UnitedHealthcare"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerName">Employer Name</Label>
                  <Input
                    id="employerName"
                    value={insuranceInfo.employerName}
                    onChange={(e) =>
                      updateInsuranceInfo("employerName", e.target.value)
                    }
                    placeholder="Sponsor of the health plan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planName">Plan Name/Group Name</Label>
                  <Input
                    id="planName"
                    value={insuranceInfo.planName}
                    onChange={(e) =>
                      updateInsuranceInfo("planName", e.target.value)
                    }
                    placeholder="e.g., PPO Plus, Self-Insured Plan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyNumber">Policy or Group Number *</Label>
                  <Input
                    id="policyNumber"
                    value={insuranceInfo.policyNumber}
                    onChange={(e) =>
                      updateInsuranceInfo("policyNumber", e.target.value)
                    }
                    placeholder="Enter policy number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberID">Member ID Number</Label>
                  <Input
                    id="memberID"
                    value={insuranceInfo.memberID}
                    onChange={(e) =>
                      updateInsuranceInfo("memberID", e.target.value)
                    }
                    placeholder="Member identification number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claimCaseNumber">Claim or Case Number</Label>
                  <Input
                    id="claimCaseNumber"
                    value={insuranceInfo.claimCaseNumber}
                    onChange={(e) =>
                      updateInsuranceInfo("claimCaseNumber", e.target.value)
                    }
                    placeholder="From denial letter (if available)"
                  />
                </div>
              </div>
            </PatientFormSection>

            {/* Section 3: Denial Information - Only show if isDenialClaim is true */}
            {isDenialClaim && (
              <PatientFormSection
                title="Denial Details"
                description="Information about the denied service or treatment"
                icon={<AlertTriangle className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="deniedService">
                      What service, medication, or procedure was denied? *
                    </Label>
                    <Input
                      id="deniedService"
                      value={denialInfo.deniedService}
                      onChange={(e) =>
                        updateDenialInfo("deniedService", e.target.value)
                      }
                      placeholder="e.g., MRI of lumbar spine, Physical therapy sessions, Wegovy prescription"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="denialDate">Date of Denial Letter</Label>
                    <Input
                      id="denialDate"
                      type="date"
                      value={denialInfo.denialDate}
                      onChange={(e) =>
                        updateDenialInfo("denialDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceDate">Date of Service</Label>
                    <Input
                      id="serviceDate"
                      type="date"
                      value={denialInfo.serviceDate}
                      onChange={(e) =>
                        updateDenialInfo("serviceDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="denialReason">Reason for Denial *</Label>
                    <Textarea
                      id="denialReason"
                      value={denialInfo.denialReason}
                      onChange={(e) =>
                        updateDenialInfo("denialReason", e.target.value)
                      }
                      placeholder="Copy and paste from denial letter or EOB: e.g., 'Service deemed not medically necessary', 'Service is experimental', 'Exceeds plan limitations'"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </PatientFormSection>
            )}

            {/* Section 4: Medical Information */}
            <PatientFormSection
              title="Medical Information"
              description="Details to build the case for medical necessity"
              icon={<Stethoscope className="h-5 w-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="primaryDiagnosis">Primary Diagnosis *</Label>
                  <Input
                    id="primaryDiagnosis"
                    value={medicalInfo.primaryDiagnosis}
                    onChange={(e) =>
                      updateMedicalInfo("primaryDiagnosis", e.target.value)
                    }
                    placeholder="What is the medical condition that requires the denied service?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referringDoctorName">
                    Referring/Prescribing Doctor
                  </Label>
                  <Input
                    id="referringDoctorName"
                    value={medicalInfo.referringDoctorName}
                    onChange={(e) =>
                      updateMedicalInfo("referringDoctorName", e.target.value)
                    }
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorSpecialty">Doctor's Specialty</Label>
                  <Input
                    id="doctorSpecialty"
                    value={medicalInfo.doctorSpecialty}
                    onChange={(e) =>
                      updateMedicalInfo("doctorSpecialty", e.target.value)
                    }
                    placeholder="e.g., Orthopedic Surgeon, Oncologist"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alternativeTreatments">
                    Alternative Treatments Tried
                  </Label>
                  <Textarea
                    id="alternativeTreatments"
                    value={medicalInfo.alternativeTreatments}
                    onChange={(e) =>
                      updateMedicalInfo("alternativeTreatments", e.target.value)
                    }
                    placeholder="List any alternative treatments attempted and explain why they were not effective"
                    rows={3}
                  />
                </div>
              </div>
            </PatientFormSection>

            {/* Section 5: Supporting Documentation */}
            <PatientFormSection
              title="Supporting Documentation"
              description="Upload evidence to support your claim appeal"
              icon={<Upload className="h-5 w-5" />}
            >
              <FileUpload
                onFilesChange={setDocuments}
                uploadedFiles={documents}
                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                maxFiles={5}
                maxSizeInMB={10}
              />
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium mb-2">Recommended Documents:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>
                    • Denial Letter / Explanation of Benefits (EOB) -{" "}
                    <strong>Most Important</strong>
                  </li>
                  <li>• Letter of Medical Necessity from your doctor</li>
                  <li>
                    • Relevant medical records (test results, doctor's notes)
                  </li>
                  <li>• Summary Plan Description (SPD) - if available</li>
                </ul>
              </div>
            </PatientFormSection>

            {/* Section 6: Your Story */}
            <PatientFormSection
              title="Your Story"
              description="Help us understand the human impact of this denial"
              icon={<MessageSquare className="h-5 w-5" />}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalNecessity">
                    Why do you believe this service/medication is necessary?
                  </Label>
                  <Textarea
                    id="medicalNecessity"
                    value={story.medicalNecessity}
                    onChange={(e) =>
                      updateStory("medicalNecessity", e.target.value)
                    }
                    placeholder="Explain in your own words why you believe this treatment is necessary for your health"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impactOnLife">
                    How has the lack of this treatment affected your daily life?
                  </Label>
                  <Textarea
                    id="impactOnLife"
                    value={story.impactOnLife}
                    onChange={(e) =>
                      updateStory("impactOnLife", e.target.value)
                    }
                    placeholder="Describe how the lack of this treatment has affected your work, daily activities, and well-being"
                    rows={4}
                  />
                </div>
              </div>
            </PatientFormSection>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="px-8 py-3 text-lg"
              >
                {loading ? "Submitting Claim..." : "Submit Comprehensive Claim"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
