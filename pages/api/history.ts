import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { VATHistory } from '@/types/vat'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VATHistory[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabase
      .from('vat_validations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Database error:', error)
      return res.status(500).json({ error: 'Failed to fetch history' })
    }

    return res.status(200).json(data || [])
  } catch (error) {
    console.error('History fetch error:', error)
    return res.status(500).json({ error: 'Failed to fetch history' })
  }
}