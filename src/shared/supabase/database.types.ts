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
          status: "New" | "Contacted" | "Closed";
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
          status?: "New" | "Contacted" | "Closed";
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
          status?: "New" | "Contacted" | "Closed";
          updated_at?: string;
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
