export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      consent_records: {
        Row: {
          consent_age_days: number | null;
          consent_context: Json | null;
          consent_form_version: string | null;
          consent_given: boolean;
          consent_given_at: string | null;
          consent_method: string;
          consent_source: string | null;
          consent_type: string;
          consent_withdrawn: boolean | null;
          consent_withdrawn_at: string | null;
          created_at: string;
          email: string | null;
          id: string;
          ip_address: unknown | null;
          privacy_policy_version: string | null;
          session_id: string | null;
          updated_at: string;
          user_agent: string | null;
          user_id: string | null;
          withdrawal_reason: string | null;
        };
        Insert: {
          consent_age_days?: number | null;
          consent_context?: Json | null;
          consent_form_version?: string | null;
          consent_given: boolean;
          consent_given_at?: string | null;
          consent_method: string;
          consent_source?: string | null;
          consent_type: string;
          consent_withdrawn?: boolean | null;
          consent_withdrawn_at?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          ip_address?: unknown | null;
          privacy_policy_version?: string | null;
          session_id?: string | null;
          updated_at?: string;
          user_agent?: string | null;
          user_id?: string | null;
          withdrawal_reason?: string | null;
        };
        Update: {
          consent_age_days?: number | null;
          consent_context?: Json | null;
          consent_form_version?: string | null;
          consent_given?: boolean;
          consent_given_at?: string | null;
          consent_method?: string;
          consent_source?: string | null;
          consent_type?: string;
          consent_withdrawn?: boolean | null;
          consent_withdrawn_at?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          ip_address?: unknown | null;
          privacy_policy_version?: string | null;
          session_id?: string | null;
          updated_at?: string;
          user_agent?: string | null;
          user_id?: string | null;
          withdrawal_reason?: string | null;
        };
        Relationships: [];
      };
      email_preferences: {
        Row: {
          created_at: string;
          email: string;
          email_type: string;
          first_name: string | null;
          id: string;
          is_active: boolean;
          last_name: string | null;
          unsubscribed_at: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          email_type: string;
          first_name?: string | null;
          id?: string;
          is_active?: boolean;
          last_name?: string | null;
          unsubscribed_at?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          email_type?: string;
          first_name?: string | null;
          id?: string;
          is_active?: boolean;
          last_name?: string | null;
          unsubscribed_at?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      email_type_categories: {
        Row: {
          category: string;
          created_at: string;
          description: string | null;
          email_type: string;
          id: string;
          requires_marketing_consent: boolean | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          description?: string | null;
          email_type: string;
          id?: string;
          requires_marketing_consent?: boolean | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string | null;
          email_type?: string;
          id?: string;
          requires_marketing_consent?: boolean | null;
        };
        Relationships: [];
      };
      organization_users: {
        Row: {
          accepted_at: string | null;
          created_at: string | null;
          id: string;
          invited_at: string | null;
          invited_by: string | null;
          org_id: string | null;
          role: string;
          status: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          accepted_at?: string | null;
          created_at?: string | null;
          id?: string;
          invited_at?: string | null;
          invited_by?: string | null;
          org_id?: string | null;
          role?: string;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          accepted_at?: string | null;
          created_at?: string | null;
          id?: string;
          invited_at?: string | null;
          invited_by?: string | null;
          org_id?: string | null;
          role?: string;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_users_org_id_fkey';
            columns: ['org_id'];
            isOneToOne: false;
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      organizations: {
        Row: {
          address_line_1: string | null;
          address_line_2: string | null;
          auto_reminders: boolean | null;
          billing_address: Json | null;
          billing_email: string | null;
          canton: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          default_currency: string | null;
          default_language: string | null;
          default_payment_terms_days: number | null;
          default_vat_rates: Json | null;
          email_notifications: boolean | null;
          iban: string | null;
          id: string;
          invoice_numbering: string | null;
          last_payment_date: string | null;
          legal_entity_type: string | null;
          legal_name: string | null;
          logo_url: string | null;
          name: string;
          onboarding_completed: boolean | null;
          onboarding_draft_data: Json | null;
          onboarding_step: number | null;
          owner_email: string | null;
          phone: string | null;
          plan: string | null;
          qr_iban: string | null;
          reminder_days: string | null;
          stripe_customer_id: string | null;
          stripe_payment_method_id: string | null;
          stripe_payment_method_type: string | null;
          stripe_subscription_current_period_end: string | null;
          stripe_subscription_id: string | null;
          stripe_subscription_status: string | null;
          subscription_start_date: string | null;
          timezone: string | null;
          uid: string | null;
          updated_at: string | null;
          vat_number: string | null;
          website: string | null;
          zip: string | null;
        };
        Insert: {
          address_line_1?: string | null;
          address_line_2?: string | null;
          auto_reminders?: boolean | null;
          billing_address?: Json | null;
          billing_email?: string | null;
          canton?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          default_currency?: string | null;
          default_language?: string | null;
          default_payment_terms_days?: number | null;
          default_vat_rates?: Json | null;
          email_notifications?: boolean | null;
          iban?: string | null;
          id?: string;
          invoice_numbering?: string | null;
          last_payment_date?: string | null;
          legal_entity_type?: string | null;
          legal_name?: string | null;
          logo_url?: string | null;
          name: string;
          onboarding_completed?: boolean | null;
          onboarding_draft_data?: Json | null;
          onboarding_step?: number | null;
          owner_email?: string | null;
          phone?: string | null;
          plan?: string | null;
          qr_iban?: string | null;
          reminder_days?: string | null;
          stripe_customer_id?: string | null;
          stripe_payment_method_id?: string | null;
          stripe_payment_method_type?: string | null;
          stripe_subscription_current_period_end?: string | null;
          stripe_subscription_id?: string | null;
          stripe_subscription_status?: string | null;
          subscription_start_date?: string | null;
          timezone?: string | null;
          uid?: string | null;
          updated_at?: string | null;
          vat_number?: string | null;
          website?: string | null;
          zip?: string | null;
        };
        Update: {
          address_line_1?: string | null;
          address_line_2?: string | null;
          auto_reminders?: boolean | null;
          billing_address?: Json | null;
          billing_email?: string | null;
          canton?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          default_currency?: string | null;
          default_language?: string | null;
          default_payment_terms_days?: number | null;
          default_vat_rates?: Json | null;
          email_notifications?: boolean | null;
          iban?: string | null;
          id?: string;
          invoice_numbering?: string | null;
          last_payment_date?: string | null;
          legal_entity_type?: string | null;
          legal_name?: string | null;
          logo_url?: string | null;
          name?: string;
          onboarding_completed?: boolean | null;
          onboarding_draft_data?: Json | null;
          onboarding_step?: number | null;
          owner_email?: string | null;
          phone?: string | null;
          plan?: string | null;
          qr_iban?: string | null;
          reminder_days?: string | null;
          stripe_customer_id?: string | null;
          stripe_payment_method_id?: string | null;
          stripe_payment_method_type?: string | null;
          stripe_subscription_current_period_end?: string | null;
          stripe_subscription_id?: string | null;
          stripe_subscription_status?: string | null;
          subscription_start_date?: string | null;
          timezone?: string | null;
          uid?: string | null;
          updated_at?: string | null;
          vat_number?: string | null;
          website?: string | null;
          zip?: string | null;
        };
        Relationships: [];
      };
      pending_registrations: {
        Row: {
          created_at: string | null;
          email: string;
          expires_at: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          updated_at: string | null;
          user_metadata: Json | null;
          verification_token: string;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          expires_at: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          verification_token: string;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          expires_at?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          verification_token?: string;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          id: string;
          name: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          id: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_consent_age: {
        Args: { consent_given_at: string };
        Returns: number;
      };
      check_consent_renewal_required: {
        Args: { p_email?: string; p_user_id?: string };
        Returns: {
          consent_type: string;
          days_until_expiry: number;
          needs_renewal: boolean;
        }[];
      };
      cleanup_expired_registrations_direct: {
        Args: Record<PropertyKey, never>;
        Returns: {
          cleaned_count: number;
          cleaned_emails: string[];
        }[];
      };
      complete_onboarding: {
        Args: { org_id: string };
        Returns: boolean;
      };
      email_type_requires_marketing_consent: {
        Args: { p_email_type: string };
        Returns: boolean;
      };
      get_email_types_by_category: {
        Args: { p_category: string };
        Returns: {
          description: string;
          email_type: string;
          requires_marketing_consent: boolean;
        }[];
      };
      get_user_consent_status: {
        Args: { p_email?: string; p_user_id?: string };
        Returns: {
          consent_age_days: number;
          consent_given: boolean;
          consent_given_at: string;
          consent_type: string;
          consent_withdrawn: boolean;
          consent_withdrawn_at: string;
          is_valid: boolean;
        }[];
      };
      get_user_organizations: {
        Args: { user_uuid: string };
        Returns: {
          org_id: string;
          org_name: string;
          role: string;
          status: string;
        }[];
      };
      update_onboarding_step: {
        Args: { new_step: number; org_id: string };
        Returns: boolean;
      };
      update_stripe_subscription: {
        Args: {
          current_period_end?: string;
          org_id: string;
          payment_method_id?: string;
          payment_method_type?: string;
          subscription_id: string;
          subscription_status?: string;
        };
        Returns: boolean;
      };
      user_has_org_access: {
        Args: { org_uuid: string; user_uuid: string };
        Returns: boolean;
      };
      user_has_organization: {
        Args: { user_uuid: string };
        Returns: boolean;
      };
      user_is_org_owner: {
        Args: { org_uuid: string; user_uuid: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          type: Database['storage']['Enums']['buckettype'];
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      buckets_analytics: {
        Row: {
          created_at: string;
          format: string;
          id: string;
          type: Database['storage']['Enums']['buckettype'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          format?: string;
          id: string;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          format?: string;
          id?: string;
          type?: Database['storage']['Enums']['buckettype'];
          updated_at?: string;
        };
        Relationships: [];
      };
      iceberg_namespaces: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'iceberg_namespaces_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets_analytics';
            referencedColumns: ['id'];
          },
        ];
      };
      iceberg_tables: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          location: string;
          name: string;
          namespace_id: string;
          updated_at: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id?: string;
          location: string;
          name: string;
          namespace_id: string;
          updated_at?: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          location?: string;
          name?: string;
          namespace_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'iceberg_tables_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets_analytics';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'iceberg_tables_namespace_id_fkey';
            columns: ['namespace_id'];
            isOneToOne: false;
            referencedRelation: 'iceberg_namespaces';
            referencedColumns: ['id'];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          level: number | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          level?: number | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          level?: number | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      prefixes: {
        Row: {
          bucket_id: string;
          created_at: string | null;
          level: number;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          bucket_id: string;
          created_at?: string | null;
          level?: number;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          bucket_id?: string;
          created_at?: string | null;
          level?: number;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'prefixes_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string };
        Returns: undefined;
      };
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string };
        Returns: undefined;
      };
      delete_leaf_prefixes: {
        Args: { bucket_ids: string[]; names: string[] };
        Returns: undefined;
      };
      delete_prefix: {
        Args: { _bucket_id: string; _name: string };
        Returns: boolean;
      };
      extension: {
        Args: { name: string };
        Returns: string;
      };
      filename: {
        Args: { name: string };
        Returns: string;
      };
      foldername: {
        Args: { name: string };
        Returns: string[];
      };
      get_level: {
        Args: { name: string };
        Returns: number;
      };
      get_prefix: {
        Args: { name: string };
        Returns: string;
      };
      get_prefixes: {
        Args: { name: string };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          bucket_id: string;
          size: number;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
          prefix_param: string;
        };
        Returns: {
          created_at: string;
          id: string;
          key: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          delimiter_param: string;
          max_keys?: number;
          next_token?: string;
          prefix_param: string;
          start_after?: string;
        };
        Returns: {
          id: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
      lock_top_prefixes: {
        Args: { bucket_ids: string[]; names: string[] };
        Returns: undefined;
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          bucketname: string;
          levels?: number;
          limits?: number;
          offsets?: number;
          prefix: string;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          created_at: string;
          id: string;
          last_accessed_at: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
      search_legacy_v1: {
        Args: {
          bucketname: string;
          levels?: number;
          limits?: number;
          offsets?: number;
          prefix: string;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          created_at: string;
          id: string;
          last_accessed_at: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
      search_v1_optimised: {
        Args: {
          bucketname: string;
          levels?: number;
          limits?: number;
          offsets?: number;
          prefix: string;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          created_at: string;
          id: string;
          last_accessed_at: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
      search_v2: {
        Args: {
          bucket_name: string;
          levels?: number;
          limits?: number;
          prefix: string;
          sort_column?: string;
          sort_column_after?: string;
          sort_order?: string;
          start_after?: string;
        };
        Returns: {
          created_at: string;
          id: string;
          key: string;
          last_accessed_at: string;
          metadata: Json;
          name: string;
          updated_at: string;
        }[];
      };
    };
    Enums: {
      buckettype: 'STANDARD' | 'ANALYTICS';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ['STANDARD', 'ANALYTICS'],
    },
  },
} as const;
