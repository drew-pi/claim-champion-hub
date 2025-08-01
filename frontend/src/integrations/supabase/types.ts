export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      claim_documents: {
        Row: {
          claim_id: string
          created_at: string | null
          document_name: string
          document_type: string
          file_path: string
          file_size: number | null
          id: string
          uploaded_by: string
        }
        Insert: {
          claim_id: string
          created_at?: string | null
          document_name: string
          document_type: string
          file_path: string
          file_size?: number | null
          id?: string
          uploaded_by: string
        }
        Update: {
          claim_id?: string
          created_at?: string | null
          document_name?: string
          document_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_documents_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_history: {
        Row: {
          action: string
          claim_id: string
          created_at: string | null
          details: string | null
          id: string
          performed_by: string
        }
        Insert: {
          action: string
          claim_id: string
          created_at?: string | null
          details?: string | null
          id?: string
          performed_by: string
        }
        Update: {
          action?: string
          claim_id?: string
          created_at?: string | null
          details?: string | null
          id?: string
          performed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_history_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          advocate_id: string | null
          alternative_treatments_tried: string | null
          claim_amount: number | null
          claim_case_number: string | null
          claim_date: string
          claim_description: string
          claim_number: string | null
          created_at: string | null
          denial_date: string | null
          denial_reason: string | null
          denial_service_date: string | null
          denial_service_description: string | null
          documents_uploaded: Json | null
          employer_address: string | null
          employer_name: string
          healthcare_provider_address: string | null
          healthcare_provider_name: string
          id: string
          impact_on_daily_life: string | null
          insurance_company: string | null
          member_id: string | null
          notes: string | null
          patient_date_of_birth: string | null
          patient_id: string
          patient_mailing_address: string | null
          patient_phone: string | null
          patient_relationship_to_patient: string | null
          patient_story: string | null
          plan_name: string | null
          policy_number: string
          primary_diagnosis: string | null
          priority: string | null
          referring_doctor_name: string | null
          referring_doctor_specialty: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          advocate_id?: string | null
          alternative_treatments_tried?: string | null
          claim_amount?: number | null
          claim_case_number?: string | null
          claim_date: string
          claim_description: string
          claim_number?: string | null
          created_at?: string | null
          denial_date?: string | null
          denial_reason?: string | null
          denial_service_date?: string | null
          denial_service_description?: string | null
          documents_uploaded?: Json | null
          employer_address?: string | null
          employer_name: string
          healthcare_provider_address?: string | null
          healthcare_provider_name: string
          id?: string
          impact_on_daily_life?: string | null
          insurance_company?: string | null
          member_id?: string | null
          notes?: string | null
          patient_date_of_birth?: string | null
          patient_id: string
          patient_mailing_address?: string | null
          patient_phone?: string | null
          patient_relationship_to_patient?: string | null
          patient_story?: string | null
          plan_name?: string | null
          policy_number: string
          primary_diagnosis?: string | null
          priority?: string | null
          referring_doctor_name?: string | null
          referring_doctor_specialty?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          advocate_id?: string | null
          alternative_treatments_tried?: string | null
          claim_amount?: number | null
          claim_case_number?: string | null
          claim_date?: string
          claim_description?: string
          claim_number?: string | null
          created_at?: string | null
          denial_date?: string | null
          denial_reason?: string | null
          denial_service_date?: string | null
          denial_service_description?: string | null
          documents_uploaded?: Json | null
          employer_address?: string | null
          employer_name?: string
          healthcare_provider_address?: string | null
          healthcare_provider_name?: string
          id?: string
          impact_on_daily_life?: string | null
          insurance_company?: string | null
          member_id?: string | null
          notes?: string | null
          patient_date_of_birth?: string | null
          patient_id?: string
          patient_mailing_address?: string | null
          patient_phone?: string | null
          patient_relationship_to_patient?: string | null
          patient_story?: string | null
          plan_name?: string | null
          policy_number?: string
          primary_diagnosis?: string | null
          priority?: string | null
          referring_doctor_name?: string | null
          referring_doctor_specialty?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_advocate_id_fkey"
            columns: ["advocate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "patient" | "advocate" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["patient", "advocate", "admin"],
    },
  },
} as const
