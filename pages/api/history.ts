import type { NextApiRequest, NextApiResponse } from 'next'
import { VATHistory } from '@/types/vat'

// MVP sans base de données : retourne un tableau vide
// L'historique sera géré en localStorage côté client
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VATHistory[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Pour le MVP, retourner un tableau vide
    // L'historique sera stocké localement dans le navigateur
    return res.status(200).json([])
  } catch (error) {
    console.error('History fetch error:', error)
    return res.status(500).json({ error: 'Failed to fetch history' })
  }
}