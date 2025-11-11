export interface VATValidationRequest {
  countryCode: string
  vatNumber: string
}

export interface VATValidationResponse {
  valid: boolean
  countryCode: string
  vatNumber: string
  name?: string
  address?: string
  requestDate?: string
}

export interface VATHistory {
  id: string
  vat_number: string
  country_code: string
  is_valid: boolean
  company_name: string | null
  company_address: string | null
  validation_date: string
  created_at: string
}