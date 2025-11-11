import * as soap from 'soap';

const VIES_WSDL = 'https://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl';

export interface VATValidationResult {
  success: boolean;
  data?: {
    valid: boolean;
    country: string;
    vatNumber: string;
    name?: string;
    address?: string;
    requestDate: string;
  };
  error?: string;
}

export async function validateVAT(
  countryCode: string,
  vatNumber: string
): Promise<VATValidationResult> {
  try {
    // Normalisation des entrées
    const normalizedCountry = countryCode.toUpperCase().trim();
    const normalizedVAT = vatNumber.replace(/[.\s-]/g, '').toUpperCase();

    // Validation basique
    if (normalizedCountry.length !== 2) {
      return {
        success: false,
        error: 'Le code pays doit contenir exactement 2 lettres',
      };
    }

    if (normalizedVAT.length < 5) {
      return {
        success: false,
        error: 'Le numéro de TVA doit contenir au moins 5 caractères',
      };
    }

    // Création du client SOAP
    const client = await soap.createClientAsync(VIES_WSDL, {
      endpoint: process.env.VIES_ENDPOINT,
    });

    // Appel du service VIES
    const result = await client.checkVatAsync({
      countryCode: normalizedCountry,
      vatNumber: normalizedVAT,
    });

    const response = result[0];

    return {
      success: true,
      data: {
        valid: response.valid === true || response.valid === 'true',
        country: response.countryCode,
        vatNumber: response.vatNumber,
        name: response.name || undefined,
        address: response.address || undefined,
        requestDate: response.requestDate,
      },
    };
  } catch (error: any) {
    // Gestion des erreurs SOAP
    const soapFault = error?.root?.Envelope?.Body?.Fault?.faultstring;

    if (soapFault) {
      if (soapFault.includes('MS_MAX_CONCURRENT_REQ')) {
        return {
          success: false,
          error: 'Le service VIES est temporairement surchargé. Veuillez réessayer dans quelques secondes.',
        };
      }

      if (soapFault.includes('MS_UNAVAILABLE')) {
        return {
          success: false,
          error: 'Service du pays temporairement indisponible. Veuillez réessayer dans quelques minutes.',
        };
      }

      if (soapFault.includes('TIMEOUT')) {
        return {
          success: false,
          error: 'Délai d\'attente dépassé. Veuillez réessayer.',
        };
      }

      if (soapFault.includes('INVALID_INPUT')) {
        return {
          success: false,
          error: 'Format de numéro de TVA invalide pour ce pays.',
        };
      }

      return {
        success: false,
        error: `Erreur lors de la validation: ${error.message || 'Erreur inconnue'}`,
      };
    }

    return {
      success: false,
      error: `Erreur lors de la validation: ${error.message || 'Erreur inconnue'}`,
    };
  }
}
