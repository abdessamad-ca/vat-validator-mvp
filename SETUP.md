# 🚀 GUIDE DE CONFIGURATION - VAT Validator MVP

## ⚠️ CORRECTIONS NÉCESSAIRES POUR LANCER EN LOCAL

Ce guide vous permet de corriger et lancer le projet en local sur Cursor.

---

## 📋 ÉTAPE 1 : Cloner le Repository

```bash
git clone https://github.com/abdessamad-ca/vat-validator-mvp.git
cd vat-validator-mvp
```

---

## 📦 ÉTAPE 2 : Installer la Dépendance Manquante SOAP

**CRITIQUE** : Le package `soap` est manquant dans le projet actuel.

```bash
npm install soap
```

Ou si vous utilisez yarn :

```bash
yarn add soap
```

---

## 🔧 ÉTAPE 3 : Configurer les Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
touch .env.local
```

Ajoutez cette ligne dans `.env.local` :

```env
VIES_ENDPOINT=https://ec.europa.eu/taxation_customs/vies/services/checkVatService
```

**Note** : Le fichier `.env.example` actuel contient des variables Supabase qui ne sont PAS nécessaires pour le MVP.

---

## ✅ ÉTAPE 4 : Vérifier que `lib/vies-client.ts` Existe

Le fichier `lib/vies-client.ts` a été ajouté au repository. Vérifiez sa présence :

```bash
ls lib/vies-client.ts
```

Si le fichier n'existe pas, il contient le client SOAP pour VIES.

---

## 🏃 ÉTAPE 5 : Installer Toutes les Dépendances

```bash
npm install
```

Ou avec yarn :

```bash
yarn install
```

---

## 🎯 ÉTAPE 6 : Lancer le Serveur de Développement

```bash
npm run dev
```

Ou avec yarn :

```bash
yarn dev
```

Le projet sera accessible sur : **http://localhost:3000**

---

## 🧪 ÉTAPE 7 : Tester la Validation

Utilisez ces numéros de TVA réels pour tester :

### France (FR)
- Code pays : `FR`
- Numéro TVA : `40303265045` (La Poste)
- Numéro TVA : `55208479858` (SNCF)

### Allemagne (DE)
- Code pays : `DE`
- Numéro TVA : `811569869` (BMW AG)

### Belgique (BE)
- Code pays : `BE`
- Numéro TVA : `0403170701` (Proximus)

---

## ⚠️ PROBLÈMES CONNUS

### 1. Architecture Pages Router vs App Router

Le projet actuel utilise **Pages Router** (`pages/` folder) au lieu du **App Router** moderne de Next.js 15.

**Solution temporaire** : Le projet fonctionnera avec Pages Router pour les tests.

**Solution permanente** : Migrer vers App Router en créant un dossier `app/` :

```bash
mkdir app
mkdir app/api
mkdir app/api/validate
```

### 2. API actuelle utilise axios au lieu de SOAP

L'API dans `pages/api/validate-vat.ts` utilise axios. Vous devrez la modifier pour utiliser le client SOAP de `lib/vies-client.ts`.

**Exemple de correction** :

```typescript
// pages/api/validate-vat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateVAT } from '@/lib/vies-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { countryCode, vatNumber } = req.body;

  if (!countryCode || !vatNumber) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const result = await validateVAT(countryCode, vatNumber);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json(result.data);
}
```

---

## 📝 CHECKLIST AVANT DE TESTER

- [ ] Repository cloné
- [ ] `npm install soap` exécuté
- [ ] Fichier `.env.local` créé avec `VIES_ENDPOINT`
- [ ] `lib/vies-client.ts` présent
- [ ] `npm install` exécuté sans erreur
- [ ] `npm run dev` lancé avec succès
- [ ] Page accessible sur http://localhost:3000
- [ ] Test de validation avec un numéro TVA réel effectué

---

## 🐛 DÉPANNAGE

### Erreur : "Cannot find module 'soap'"

**Solution** :
```bash
npm install soap
npm run dev
```

### Erreur : "VIES_ENDPOINT is not defined"

**Solution** : Vérifiez que le fichier `.env.local` existe et contient :
```
VIES_ENDPOINT=https://ec.europa.eu/taxation_customs/vies/services/checkVatService
```

### Erreur : "Service temporairement indisponible"

**Cause** : Le service VIES de l'UE peut être temporairement hors ligne ou le pays spécifique est indisponible.

**Solution** : Attendez quelques minutes et réessayez, ou testez avec un autre pays.

### Erreur de compilation TypeScript

**Solution** :
```bash
rm -rf .next
npm run dev
```

---

## 🎉 RÉSULTAT ATTENDU

Après avoir suivi ce guide :

✅ Le serveur démarre sans erreur  
✅ La page s'affiche sur http://localhost:3000  
✅ La validation VIES fonctionne avec de vrais numéros de TVA  
✅ Les erreurs sont gérées correctement  

---

## 📞 SUPPORT

Si vous rencontrez des problèmes après avoir suivi ce guide :

1. Vérifiez la checklist ci-dessus
2. Consultez les logs dans le terminal
3. Vérifiez la console du navigateur (F12)

---

**Date de création** : 11 novembre 2025  
**Dernière mise à jour** : 11 novembre 2025
