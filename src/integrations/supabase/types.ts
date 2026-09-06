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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      portal_characters: {
        Row: {
          character_id: number
          created_at: string
          decided_at: string | null
          decided_by: string | null
          faction: string | null
          firstname: string
          id: string
          is_lspd: boolean
          lastname: string
          memberid: number | null
          photo: string
          raw: Json
          requested_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          character_id: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          faction?: string | null
          firstname?: string
          id?: string
          is_lspd?: boolean
          lastname?: string
          memberid?: number | null
          photo?: string
          raw?: Json
          requested_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          character_id?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          faction?: string | null
          firstname?: string
          id?: string
          is_lspd?: boolean
          lastname?: string
          memberid?: number | null
          photo?: string
          raw?: Json
          requested_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_characters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_login_logs: {
        Row: {
          created_at: string
          detail: string | null
          event: string
          id: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          detail?: string | null
          event: string
          id?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          detail?: string | null
          event?: string
          id?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_login_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_roster: {
        Row: {
          created_at: string
          created_by: string | null
          discord: string
          division: string
          email: string
          id: string
          name: string
          note: string
          phone: string
          photo: string
          profile_key: string | null
          rank: string
          serial_no: string
          sort_order: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discord?: string
          division?: string
          email?: string
          id?: string
          name: string
          note?: string
          phone?: string
          photo?: string
          profile_key?: string | null
          rank?: string
          serial_no?: string
          sort_order?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discord?: string
          division?: string
          email?: string
          id?: string
          name?: string
          note?: string
          phone?: string
          photo?: string
          profile_key?: string | null
          rank?: string
          serial_no?: string
          sort_order?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portal_roster_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "portal_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_roster_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token_hash: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token_hash: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token_hash?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["portal_user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["portal_user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["portal_user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "portal_users"
            referencedColumns: ["id"]
          },
        ]
      }
      portal_users: {
        Row: {
          characters: Json
          created_at: string
          decided_at: string | null
          decided_by: string | null
          id: string
          last_login_at: string | null
          profile: Json
          profile_completed: boolean
          selected_character: string | null
          status: string
          ucp_access_token: string | null
          ucp_role: string | null
          ucp_user_id: number
          updated_at: string
          username: string
        }
        Insert: {
          characters?: Json
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          last_login_at?: string | null
          profile?: Json
          profile_completed?: boolean
          selected_character?: string | null
          status?: string
          ucp_access_token?: string | null
          ucp_role?: string | null
          ucp_user_id: number
          updated_at?: string
          username: string
        }
        Update: {
          characters?: Json
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          last_login_at?: string | null
          profile?: Json
          profile_completed?: boolean
          selected_character?: string | null
          status?: string
          ucp_access_token?: string | null
          ucp_role?: string | null
          ucp_user_id?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_portal_role: {
        Args: {
          _role: Database["public"]["Enums"]["portal_user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      portal_user_role:
        | "user"
        | "admin"
        | "supervisor"
        | "faction_management"
        | "query"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      portal_user_role: [
        "user",
        "admin",
        "supervisor",
        "faction_management",
        "query",
      ],
    },
  },
} as const
