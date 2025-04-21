export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: string
          created_at?: string
        }
      }
      booking_requests: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string
          course: string
          additional_info?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone: string
          course: string
          additional_info?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string
          course?: string
          additional_info?: string
          created_at?: string
        }
      }
    }
  }
}