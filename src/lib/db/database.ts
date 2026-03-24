export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          brn: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          deleted_at: string | null
          disclaimer: string | null
          id: string
          logo_url: string | null
          mode: string
          name: string
          post_code: string | null
          region: string | null
          terms: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          brn?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          deleted_at?: string | null
          disclaimer?: string | null
          id?: string
          logo_url?: string | null
          mode: string
          name: string
          post_code?: string | null
          region?: string | null
          terms?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          brn?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          deleted_at?: string | null
          disclaimer?: string | null
          id?: string
          logo_url?: string | null
          mode?: string
          name?: string
          post_code?: string | null
          region?: string | null
          terms?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_role: {
        Row: {
          company_id: string
          id: string
          name: string
        }
        Insert: {
          company_id: string
          id?: string
          name: string
        }
        Update: {
          company_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_role_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_role_permission: {
        Row: {
          can_delete: boolean
          can_read: boolean
          can_write: boolean
          company_role_id: string
          id: string
          module: string
        }
        Insert: {
          can_delete: boolean
          can_read: boolean
          can_write: boolean
          company_role_id: string
          id?: string
          module: string
        }
        Update: {
          can_delete?: boolean
          can_read?: boolean
          can_write?: boolean
          company_role_id?: string
          id?: string
          module?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_role_permission_company_role_id_fkey"
            columns: ["company_role_id"]
            isOneToOne: false
            referencedRelation: "company_role"
            referencedColumns: ["id"]
          },
        ]
      }
      company_user: {
        Row: {
          company_id: string
          id: string
          is_owner: boolean
          joined_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          id?: string
          is_owner?: boolean
          joined_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          id?: string
          is_owner?: boolean
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_user_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_user_role: {
        Row: {
          company_role_id: string
          company_user_id: string
          id: string
        }
        Insert: {
          company_role_id: string
          company_user_id: string
          id?: string
        }
        Update: {
          company_role_id?: string
          company_user_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_user_role_company_role_id_fkey"
            columns: ["company_role_id"]
            isOneToOne: false
            referencedRelation: "company_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_user_role_company_user_id_fkey"
            columns: ["company_user_id"]
            isOneToOne: false
            referencedRelation: "company_user"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_meal_items: {
        Row: {
          food_name: string
          id: string
          meal_id: string
          notes: string | null
          order_index: number
          quantity: string
        }
        Insert: {
          food_name: string
          id?: string
          meal_id: string
          notes?: string | null
          order_index?: number
          quantity: string
        }
        Update: {
          food_name?: string
          id?: string
          meal_id?: string
          notes?: string | null
          order_index?: number
          quantity?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_meal_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "diet_plan_meals"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plan_assignments: {
        Row: {
          assigned_by: string
          company_id: string
          created_at: string
          diet_plan_id: string
          id: string
          member_id: string
          start_date: string | null
          status: string
        }
        Insert: {
          assigned_by: string
          company_id: string
          created_at?: string
          diet_plan_id: string
          id?: string
          member_id: string
          start_date?: string | null
          status?: string
        }
        Update: {
          assigned_by?: string
          company_id?: string
          created_at?: string
          diet_plan_id?: string
          id?: string
          member_id?: string
          start_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "diet_plan_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plan_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "diet_plan_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plan_assignments_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plan_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plan_meals: {
        Row: {
          day_index: number | null
          diet_plan_id: string
          id: string
          meal_type: string
          notes: string | null
          order_index: number
        }
        Insert: {
          day_index?: number | null
          diet_plan_id: string
          id?: string
          meal_type: string
          notes?: string | null
          order_index?: number
        }
        Update: {
          day_index?: number | null
          diet_plan_id?: string
          id?: string
          meal_type?: string
          notes?: string | null
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "diet_plan_meals_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "diet_plans_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plans_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
        ]
      }
      member_measurements: {
        Row: {
          body_fat: number | null
          company_id: string
          created_at: string
          id: string
          member_id: string
          metrics: Json | null
          notes: string | null
          recorded_at: string
          recorded_by: string | null
          weight: number | null
        }
        Insert: {
          body_fat?: number | null
          company_id: string
          created_at?: string
          id?: string
          member_id: string
          metrics?: Json | null
          notes?: string | null
          recorded_at?: string
          recorded_by?: string | null
          weight?: number | null
        }
        Update: {
          body_fat?: number | null
          company_id?: string
          created_at?: string
          id?: string
          member_id?: string
          metrics?: Json | null
          notes?: string | null
          recorded_at?: string
          recorded_by?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_measurements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_measurements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_measurements_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_measurements_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
        ]
      }
      member_medical_history: {
        Row: {
          created_at: string
          created_by: string | null
          details: string | null
          id: string
          member_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          details?: string | null
          id?: string
          member_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          details?: string | null
          id?: string
          member_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_medical_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_medical_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "member_medical_history_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_memberships: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          end_date: string
          id: string
          member_id: string
          plan_id: string
          start_date: string
          status: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          end_date: string
          id?: string
          member_id: string
          plan_id: string
          start_date: string
          status?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          end_date?: string
          id?: string
          member_id?: string
          plan_id?: string
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_memberships_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_memberships_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "member_memberships_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_memberships_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          assigned_coach_id: string | null
          company_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          dob: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          medical_notes: string | null
          member_code: string | null
          phone: string | null
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          assigned_coach_id?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          medical_notes?: string | null
          member_code?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          assigned_coach_id?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          dob?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          medical_notes?: string | null
          member_code?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_assigned_coach_id_fkey"
            columns: ["assigned_coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_assigned_coach_id_fkey"
            columns: ["assigned_coach_id"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          duration_days: number
          entree_fee: number
          features: string[] | null
          id: string
          is_active: boolean
          is_monthly: boolean
          name: string
          price: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          duration_days?: number
          entree_fee?: number
          features?: string[] | null
          id?: string
          is_active?: boolean
          is_monthly?: boolean
          name: string
          price?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          duration_days?: number
          entree_fee?: number
          features?: string[] | null
          id?: string
          is_active?: boolean
          is_monthly?: boolean
          name?: string
          price?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "membership_plans_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_plans_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_company_id: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          picture_url: string | null
          updated_at: string
        }
        Insert: {
          active_company_id?: string | null
          created_at?: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          picture_url?: string | null
          updated_at?: string
        }
        Update: {
          active_company_id?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          picture_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_active_company_id_fkey"
            columns: ["active_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plan_assignments: {
        Row: {
          assigned_by: string
          company_id: string
          created_at: string
          id: string
          member_id: string
          plan_id: string
          start_date: string | null
          status: string
        }
        Insert: {
          assigned_by: string
          company_id: string
          created_at?: string
          id?: string
          member_id: string
          plan_id: string
          start_date?: string | null
          status?: string
        }
        Update: {
          assigned_by?: string
          company_id?: string
          created_at?: string
          id?: string
          member_id?: string
          plan_id?: string
          start_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_plan_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plan_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "training_plan_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plan_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plan_assignments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plan_sessions: {
        Row: {
          created_at: string
          day_index: number | null
          id: string
          notes: string | null
          order_index: number
          plan_id: string
          title: string
        }
        Insert: {
          created_at?: string
          day_index?: number | null
          id?: string
          notes?: string | null
          order_index?: number
          plan_id: string
          title: string
        }
        Update: {
          created_at?: string
          day_index?: number | null
          id?: string
          notes?: string | null
          order_index?: number
          plan_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_plan_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plans: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          level: number | null
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          level?: number | null
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          level?: number | null
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
          {
            foreignKeyName: "training_plans_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "v_company_coaches"
            referencedColumns: ["coach_id"]
          },
        ]
      }
      training_session_exercises: {
        Row: {
          id: string
          name: string
          order_index: number
          reps: number | null
          rest_seconds: number | null
          session_id: string
          sets: number | null
          tempo: string | null
          weight: number | null
        }
        Insert: {
          id?: string
          name: string
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          session_id: string
          sets?: number | null
          tempo?: string | null
          weight?: number | null
        }
        Update: {
          id?: string
          name?: string
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          session_id?: string
          sets?: number | null
          tempo?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_session_exercises_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_plan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_company_coaches: {
        Row: {
          coach_id: string | null
          company_id: string | null
          label: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_user_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_member: { Args: { p_member_id: string }; Returns: boolean }
      create_diet_plan_with_meals: {
        Args: { p_payload: Json }
        Returns: string
      }
      create_member_with_membership: {
        Args: {
          p_address?: string
          p_assigned_coach_id?: string
          p_company_id: string
          p_created_by: string
          p_dob: string
          p_email: string
          p_emergency_contact_name?: string
          p_emergency_contact_phone: string
          p_end_date: string
          p_first_name: string
          p_gender: string
          p_last_name: string
          p_medical_notes?: string
          p_member_code?: string
          p_member_status: Database["public"]["Enums"]["member_status"]
          p_membership_status?: string
          p_phone: string
          p_plan_id: string
          p_start_date?: string
        }
        Returns: {
          member_id: string
          membership_id: string
        }[]
      }
      create_training_plan_with_sessions: {
        Args: { p_payload: Json }
        Returns: string
      }
      ensure_active_company_or_personal_workspace: {
        Args: never
        Returns: Json
      }
      has_company_role: {
        Args: { _company_id: string; _role: string }
        Returns: boolean
      }
      is_company_member: { Args: { _company_id: string }; Returns: boolean }
      is_company_owner: { Args: { _company_id: string }; Returns: boolean }
      update_diet_plan_with_meals: {
        Args: { p_payload: Json }
        Returns: string
      }
      update_training_plan_with_sessions: {
        Args: { p_payload: Json }
        Returns: string
      }
    }
    Enums: {
      company_common_role: "admin" | "staff" | "coach"
      company_mode: "personal" | "company"
      member_status: "active" | "inactive"
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
      company_common_role: ["admin", "staff", "coach"],
      company_mode: ["personal", "company"],
      member_status: ["active", "inactive"],
    },
  },
} as const
