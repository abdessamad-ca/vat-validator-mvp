import type { NextApiRequest, NextApiResponse } from 'next'
import { validateVAT, VATValidationResult } from '@/lib/vies-client'

type ResponseData = 
  | VATValidationResult['data']
  | { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { countryCode, vatNumber } = req.body

    // Validation des entrées
    if (!countryCode || !vatNumber) {
      return res.status(400).json({ 
        error: 'Le code pays et le numéro de TVA sont requis' 
      })
    }

    if (typeof countryCode !== 'string' || typeof vatNumber !== 'string') {
      return res.status(400).json({ 
        error: 'Format de données invalide' 
      })
    }

    if (countryCode.length !== 2) {
      return res.status(400).json({ 
        error: 'Le code pays doit contenir 2 lettres' 
      })
    }

    if (vatNumber.length < 5) {
      return res.status(400).json({ 
        error: 'Le numéro de TVA doit contenir au moins 5 caractères' 
      })
    }

    // Appel du service VIES via le client SOAP
    const result = await validateVAT(countryCode, vatNumber)

    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Erreur de validation' })
    }

    // Retourner les données de validation
    return res.status(200).json(result.data!)

  } catch (error: any) {
    console.error('Erreur API validation:', error)
    return res.status(500).json({ 
      error: 'Erreur serveur lors de la validation' 
    })
  }
}