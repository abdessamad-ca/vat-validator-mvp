import { useEffect, useState } from 'react'
import { VATHistory } from '@/types/vat'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Clé de stockage localStorage
const HISTORY_STORAGE_KEY = 'vat-validation-history'

export default function ValidationHistory() {
  const [history, setHistory] = useState<VATHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHistory()
    
    // Écouter les événements de validation pour mettre à jour l'historique
    const handleValidation = (event: CustomEvent) => {
      addToHistory(event.detail)
    }
    
    window.addEventListener('vat-validated' as any, handleValidation as any)
    
    return () => {
      window.removeEventListener('vat-validated' as any, handleValidation as any)
    }
  }, [])

  const fetchHistory = async () => {
    try {
      // Charger depuis localStorage pour le MVP
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addToHistory = (validation: any) => {
    const newEntry: VATHistory = {
      id: Date.now().toString(),
      vat_number: validation.vatNumber,
      country_code: validation.country || validation.countryCode,
      is_valid: validation.valid,
      company_name: validation.name || null,
      company_address: validation.address || null,
      validation_date: validation.requestDate || new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    const updatedHistory = [newEntry, ...history].slice(0, 100) // Garder les 100 derniers
    setHistory(updatedHistory)
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Chargement de l'historique...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Historique des validations
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-600">Aucune validation pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro TVA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(item.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.country_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {item.vat_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.is_valid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.is_valid ? 'Valide' : 'Invalide'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.company_name || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}