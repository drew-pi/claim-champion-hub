-- Create storage bucket for patient documents
INSERT INTO storage.buckets (id, name, public) VALUES ('patient-documents', 'patient-documents', false);

-- Create policies for patient documents bucket
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'patient-documents');

CREATE POLICY "Allow authenticated users to view their documents"  
ON storage.objects
FOR SELECT
USING (bucket_id = 'patient-documents');

-- Update claims table to support new structure
ALTER TABLE public.claims 
ADD COLUMN IF NOT EXISTS patient_date_of_birth DATE,
ADD COLUMN IF NOT EXISTS patient_mailing_address TEXT,
ADD COLUMN IF NOT EXISTS patient_phone TEXT,
ADD COLUMN IF NOT EXISTS patient_relationship_to_patient TEXT DEFAULT 'self',
ADD COLUMN IF NOT EXISTS insurance_company TEXT,
ADD COLUMN IF NOT EXISTS plan_name TEXT,
ADD COLUMN IF NOT EXISTS member_id TEXT,
ADD COLUMN IF NOT EXISTS claim_case_number TEXT,
ADD COLUMN IF NOT EXISTS denial_service_description TEXT,
ADD COLUMN IF NOT EXISTS denial_date DATE,
ADD COLUMN IF NOT EXISTS denial_reason TEXT,
ADD COLUMN IF NOT EXISTS denial_service_date DATE,
ADD COLUMN IF NOT EXISTS primary_diagnosis TEXT,
ADD COLUMN IF NOT EXISTS referring_doctor_name TEXT,
ADD COLUMN IF NOT EXISTS referring_doctor_specialty TEXT,
ADD COLUMN IF NOT EXISTS alternative_treatments_tried TEXT,
ADD COLUMN IF NOT EXISTS patient_story TEXT,
ADD COLUMN IF NOT EXISTS impact_on_daily_life TEXT,
ADD COLUMN IF NOT EXISTS documents_uploaded JSONB DEFAULT '[]'::jsonb;