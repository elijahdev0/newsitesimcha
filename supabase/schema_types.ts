export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_details: {
        Row: {
          address: string | null
          birthday: string | null
          booking_id: string
          city: string | null
          country: string | null
          created_at: string
          dietary_restrictions_details: string | null
          email: string | null
          emergency_name: string | null
          emergency_phone: string | null
          emergency_relationship: string | null
          first_name: string | null
          has_dietary_restrictions: boolean | null
          has_medical_conditions: boolean | null
          id: string
          last_name: string | null
          medical_conditions_details: string | null
          medications_details: string | null
          phone: string | null
          signature_date: string | null
          signature_name: string | null
          takes_medications: boolean | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          birthday?: string | null
          booking_id: string
          city?: string | null
          country?: string | null
          created_at?: string
          dietary_restrictions_details?: string | null
          email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          first_name?: string | null
          has_dietary_restrictions?: boolean | null
          has_medical_conditions?: boolean | null
          id?: string
          last_name?: string | null
          medical_conditions_details?: string | null
          medications_details?: string | null
          phone?: string | null
          signature_date?: string | null
          signature_name?: string | null
          takes_medications?: boolean | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          birthday?: string | null
          booking_id?: string
          city?: string | null
          country?: string | null
          created_at?: string
          dietary_restrictions_details?: string | null
          email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          first_name?: string | null
          has_dietary_restrictions?: boolean | null
          has_medical_conditions?: boolean | null
          id?: string
          last_name?: string | null
          medical_conditions_details?: string | null
          medications_details?: string | null
          phone?: string | null
          signature_date?: string | null
          signature_name?: string | null
          takes_medications?: boolean | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_details_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_extras: {
        Row: {
          booking_id: string
          created_at: string
          extra_id: string
          id: string
          price_at_booking: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          extra_id: string
          id?: string
          price_at_booking: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          extra_id?: string
          id?: string
          price_at_booking?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_extras_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_extras_extra_id_fkey"
            columns: ["extra_id"]
            isOneToOne: false
            referencedRelation: "extras"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          course_date_id: string
          course_id: string
          created_at: string
          document_path: string | null
          files_uploaded: boolean
          forms_filled: boolean
          id: string
          payment_status: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          course_date_id: string
          course_id: string
          created_at?: string
          document_path?: string | null
          files_uploaded?: boolean
          forms_filled?: boolean
          id?: string
          payment_status?: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          course_date_id?: string
          course_id?: string
          created_at?: string
          document_path?: string | null
          files_uploaded?: boolean
          forms_filled?: boolean
          id?: string
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_course_date_id_fkey"
            columns: ["course_date_id"]
            isOneToOne: false
            referencedRelation: "course_dates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_dates: {
        Row: {
          course_id: string
          created_at: string
          end_date: string
          id: string
          max_participants: number
          start_date: string
        }
        Insert: {
          course_id: string
          created_at?: string
          end_date: string
          id?: string
          max_participants?: number
          start_date: string
        }
        Update: {
          course_id?: string
          created_at?: string
          end_date?: string
          id?: string
          max_participants?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_dates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          id: string
          price: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          price: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          price?: number
          title?: string
        }
        Relationships: []
      }
      extras: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
