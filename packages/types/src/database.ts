export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          avatar_path: string | null;
          created_at: string;
          display_name: string | null;
          email: string;
          job_title: string | null;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_path?: string | null;
          created_at?: string;
          display_name?: string | null;
          email: string;
          job_title?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_path?: string | null;
          created_at?: string;
          display_name?: string | null;
          email?: string;
          job_title?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_users_legacy: {
        Row: {
          created_at: string;
          email: string;
        };
        Insert: {
          created_at?: string;
          email: string;
        };
        Update: {
          created_at?: string;
          email?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_auth_user_id: string | null;
          actor_crm_user_id: string | null;
          actor_email: string | null;
          actor_role: Database["public"]["Enums"]["crm_access_role"] | null;
          after_data: Record<string, unknown> | null;
          before_data: Record<string, unknown> | null;
          created_at: string;
          id: string;
          request_id: string | null;
          resource_id: string | null;
          resource_type: string;
        };
        Insert: {
          action: string;
          actor_auth_user_id?: string | null;
          actor_crm_user_id?: string | null;
          actor_email?: string | null;
          actor_role?: Database["public"]["Enums"]["crm_access_role"] | null;
          after_data?: Record<string, unknown> | null;
          before_data?: Record<string, unknown> | null;
          created_at?: string;
          id?: string;
          request_id?: string | null;
          resource_id?: string | null;
          resource_type: string;
        };
        Update: {
          action?: string;
          actor_auth_user_id?: string | null;
          actor_crm_user_id?: string | null;
          actor_email?: string | null;
          actor_role?: Database["public"]["Enums"]["crm_access_role"] | null;
          after_data?: Record<string, unknown> | null;
          before_data?: Record<string, unknown> | null;
          created_at?: string;
          id?: string;
          request_id?: string | null;
          resource_id?: string | null;
          resource_type?: string;
        };
        Relationships: [];
      };
      crm_users: {
        Row: {
          auth_user_id: string | null;
          created_at: string;
          created_by: string | null;
          disabled_at: string | null;
          email: string;
          id: string;
          last_login_at: string | null;
          role: Database["public"]["Enums"]["crm_access_role"];
          status: Database["public"]["Enums"]["crm_user_status"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          auth_user_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          disabled_at?: string | null;
          email: string;
          id?: string;
          last_login_at?: string | null;
          role?: Database["public"]["Enums"]["crm_access_role"];
          status?: Database["public"]["Enums"]["crm_user_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          auth_user_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          disabled_at?: string | null;
          email?: string;
          id?: string;
          last_login_at?: string | null;
          role?: Database["public"]["Enums"]["crm_access_role"];
          status?: Database["public"]["Enums"]["crm_user_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          company: string;
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          phone: string | null;
          property_type: string;
          status: "New" | "Contacted" | "Qualified" | "Won" | "Lost" | "Closed";
          updated_at: string;
        };
        Insert: {
          company: string;
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          phone?: string | null;
          property_type: string;
          status?:
            "New" | "Contacted" | "Qualified" | "Won" | "Lost" | "Closed";
          updated_at?: string;
        };
        Update: {
          company?: string;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          phone?: string | null;
          property_type?: string;
          status?:
            "New" | "Contacted" | "Qualified" | "Won" | "Lost" | "Closed";
          updated_at?: string;
        };
        Relationships: [];
      };
      follow_ups: {
        Row: {
          id: string;
          inquiry_id: string;
          title: string;
          notes: string | null;
          due_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          inquiry_id: string;
          title: string;
          notes?: string | null;
          due_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          notes?: string | null;
          due_at?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      inquiry_activities: {
        Row: {
          activity_type: "note" | "status_change";
          body: string | null;
          created_at: string;
          from_status: string | null;
          id: string;
          inquiry_id: string;
          to_status: string | null;
        };
        Insert: {
          activity_type: "note" | "status_change";
          body?: string | null;
          created_at?: string;
          from_status?: string | null;
          id?: string;
          inquiry_id: string;
          to_status?: string | null;
        };
        Update: {
          activity_type?: "note" | "status_change";
          body?: string | null;
          created_at?: string;
          from_status?: string | null;
          id?: string;
          inquiry_id?: string;
          to_status?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      admin_users: {
        Row: {
          created_at: string;
          email: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Functions: Record<never, never>;
    Enums: {
      crm_access_role: "USER" | "MANAGER" | "ADMIN";
      crm_user_status: "INVITED" | "ACTIVE" | "DISABLED";
    };
    CompositeTypes: Record<never, never>;
  };
};
