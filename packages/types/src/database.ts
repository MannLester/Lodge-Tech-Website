export type Database = {
  public: {
    Tables: {
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
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
