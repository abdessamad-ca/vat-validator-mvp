import { useState } from 'react'
import { VATValidationResponse } from '@/types/vat'

const EU_COUNTRIES = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DE', name: 'Germany' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'EL', name: 'Greece' },
  { code: 'ES', name: 'Spain' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'HR', name: 'Croatia' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'LV', name: 'Latvia' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'SE', name: 'Sweden' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SK', name: 'Slovakia' },
]

export default function VATValidator() {
  const [countryCode, setCountryCode] = useState('FR')
  const [vatNumber, setVatNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VATValidationResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/validate-vat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryCode, vatNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Validation failed')
      }

      setResult(data)
      
      // Émettre un événement pour mettre à jour l'historique
      if (data.valid) {
        window.dispatchEvent(new CustomEvent('vat-validated', { detail: data }))
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Validation de numéro de TVA
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Pays
          </label>
          <select
            id="country"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {EU_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de TVA (sans le code pays)
          </label>
          <input
            type="text"
            id="vatNumber"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            placeholder="Ex: 12345678901"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !vatNumber}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Validation en cours...' : 'Valider'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
          {error.includes('surchargé') && (
            <button
              onClick={handleSubmit}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              🔄 Réessayer maintenant
            </button>
          )}
        </div>
      )}

      {result && (
        <div className={`mt-4 p-4 rounded-md ${
          result.valid 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`font-bold mb-2 ${
            result.valid ? 'text-green-800' : 'text-red-800'
          }`}>
            {result.valid ? '✅ Numéro de TVA valide' : '❌ Numéro de TVA invalide'}
          </h3>
          
          {result.valid && (
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Pays:</strong> {result.countryCode}</p>
              <p><strong>Numéro:</strong> {result.vatNumber}</p>
              {result.name && <p><strong>Nom:</strong> {result.name}</p>}
              {result.address && (
                <p><strong>Adresse:</strong> {result.address}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}