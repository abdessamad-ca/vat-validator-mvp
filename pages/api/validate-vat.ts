import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { supabase } from '@/lib/supabase'
import { VATValidationResponse } from '@/types/vat'

type VIESResponse = {
  valid: boolean
  countryCode: string
  vatNumber: string
  requestDate: string
  name?: string
  address?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VATValidationResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { countryCode, vatNumber } = req.body

  if (!countryCode || !vatNumber) {
    return res.status(400).json({ error: 'Country code and VAT number are required' })
  }

  try {
    // Appel à l'API VIES de la Commission Européenne
    const response = await axios.get(
      `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${countryCode}/vat/${vatNumber}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000,
      }
    )

    const viesData: VIESResponse = response.data

    // Enregistrement dans Supabase
    const { error: dbError } = await supabase
      .from('vat_validations')
      .insert({
        vat_number: vatNumber,
        country_code: countryCode,
        is_valid: viesData.valid,
        company_name: viesData.name || null,
        company_address: viesData.address || null,
        validation_date: viesData.requestDate || new Date().toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return res.status(200).json({
      valid: viesData.valid,
      countryCode: viesData.countryCode,
      vatNumber: viesData.vatNumber,
      name: viesData.name,
      address: viesData.address,
      requestDate: viesData.requestDate,
    })
  } catch (error: any) {
    console.error('VAT validation error:', error)
    
    if (error.response?.status === 404) {
      return res.status(200).json({
        valid: false,
        countryCode,
        vatNumber,
      })
    }

    return res.status(500).json({ 
      error: 'Failed to validate VAT number. Please try again.' 
    })
  }
}