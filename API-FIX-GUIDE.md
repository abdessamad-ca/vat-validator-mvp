# 🔧 CORRECTION DE L'API - Remplacer axios par SOAP

## 🚨 PROBLÈME ACTUEL

L'API dans `pages/api/validate-vat.ts` utilise **axios** pour faire des appels REST au lieu d'utiliser le **client SOAP VIES**.

Cela ne fonctionnera pas car l'API VIES nécessite SOAP.

---

## ✅ SOLUTION : Remplacer le fichier API

### Ouvrez le fichier : `pages/api/validate-vat.ts`

Remplacez TOUT le contenu par ce code corrigé :

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateVAT, VATValidationResult } from '@/lib/vies-client';

type ResponseData = 
  | VATValidationResult['data']
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { countryCode, vatNumber } = req.body;

    // Validation des entrées
    if (!countryCode || !vatNumber) {
      return res.status(400).json({ 
        error: 'Le code pays et le numéro de TVA sont requis' 
      });
    }

    if (typeof countryCode !== 'string' || typeof vatNumber !== 'string') {
      return res.status(400).json({ 
        error: 'Format de données invalide' 
      });
    }

    if (countryCode.length !== 2) {
      return res.status(400).json({ 
        error: 'Le code pays doit contenir 2 lettres' 
      });
    }

    if (vatNumber.length < 5) {
      return res.status(400).json({ 
        error: 'Le numéro de TVA doit contenir au moins 5 caractères' 
      });
    }

    // Appel du service VIES via le client SOAP
    const result = await validateVAT(countryCode, vatNumber);

    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Erreur de validation' });
    }

    // Retourner les données de validation
    return res.status(200).json(result.data!);

  } catch (error: any) {
    console.error('Erreur API validation:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur lors de la validation' 
    });
  }
}
```

---

## 📝 CHANGEMENTS CLÉS

### 1. Import du client SOAP
```typescript
import { validateVAT, VATValidationResult } from '@/lib/vies-client';
```
⚠️ **Au lieu de** : `import axios from 'axios'`

### 2. Utilisation de la fonction validateVAT
```typescript
const result = await validateVAT(countryCode, vatNumber);
```
⚠️ **Au lieu de** : `const response = await axios.get(...)`

### 3. Gestion des erreurs améliorée
```typescript
if (!result.success) {
  return res.status(400).json({ error: result.error || 'Erreur de validation' });
}
```

---

## ✅ VÉRIFICATION

Après avoir remplacé le code :

1. **Redémarrez le serveur** :
   ```bash
   npm run dev
   ```

2. **Testez avec un numéro de TVA réel** :
   - Code pays : `FR`
   - Numéro TVA : `40303265045` (La Poste)

3. **Vérifiez la réponse dans la console** :
   - Vous devriez voir les détails de l'entreprise
   - Le nom et l'adresse s'affichent

---

## 🐛 SI ÇA NE FONCTIONNE PAS

### Erreur : "Cannot find module '@/lib/vies-client'"

**Solution** : Vérifiez votre `tsconfig.json` :

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Ou changez l'import en chemin relatif :
```typescript
import { validateVAT } from '../../lib/vies-client';
```

### Erreur : "Cannot find module 'soap'"

**Solution** : Installez soap :
```bash
npm install soap
```

### Erreur : "VIES_ENDPOINT is not defined"

**Solution** : Vérifiez votre fichier `.env.local` :
```bash
cat .env.local
```

Il doit contenir :
```
VIES_ENDPOINT=https://ec.europa.eu/taxation_customs/vies/services/checkVatService
```

---

## 🎯 RÉSULTAT ATTENDU

Après cette correction :

✅ L'API utilise SOAP au lieu d'axios  
✅ Les validations VIES fonctionnent correctement  
✅ Les noms et adresses d'entreprises s'affichent  
✅ La gestion d'erreurs est robuste  

---

**Dernière mise à jour** : 11 novembre 2025
