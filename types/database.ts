export type Database = {
  public: {
    Tables: {
      vat_validations: {
        Row: {
          id: string
          vat_number: string
          country_code: string
          is_valid: boolean
          company_name: string | null
          company_address: string | null
          validation_date: string
          created_at: string
        }
        Insert: {
          id?: string
          vat_number: string
          country_code: string
          is_valid: boolean
          company_name?: string | null
          company_address?: string | null
          validation_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          vat_number?: string
          country_code?: string
          is_valid?: boolean
          company_name?: string | null
          company_address?: string | null
          validation_date?: string
          created_at?: string
        }
      }
    }
  }
}