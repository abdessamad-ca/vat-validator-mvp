import Head from 'next/head'
import VATValidator from '@/components/VATValidator'
import ValidationHistory from '@/components/ValidationHistory'

export default function Home() {
  return (
    <>
      <Head>
        <title>VAT Validator - Validation de numéros TVA intracommunautaires</title>
        <meta name="description" content="Validez les numéros de TVA intracommunautaires avec l'API VIES" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🇪🇺 VAT Validator
            </h1>
            <p className="text-gray-600">
              Validation instantanée de numéros de TVA intracommunautaires
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <VATValidator />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                📊 Statistiques
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Validations totales</p>
                  <p className="text-3xl font-bold text-primary">-</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Numéros valides</p>
                  <p className="text-3xl font-bold text-secondary">-</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    💡 <strong>Comment ça marche ?</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Sélectionnez le pays UE</li>
                    <li>• Entrez le numéro de TVA</li>
                    <li>• Vérification en temps réel via VIES</li>
                    <li>• Résultats instantanés</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <ValidationHistory />

          <footer className="text-center mt-12 text-gray-600 text-sm">
            <p>
              Données fournies par{' '}
              <a
                href="https://ec.europa.eu/taxation_customs/vies/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                VIES (VAT Information Exchange System)
              </a>
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}