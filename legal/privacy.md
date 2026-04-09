# Politique de Confidentialité

**Épiceries Faciles**
Dernière mise à jour : [DATE]
Version : 1.0

Conforme à la **Loi 25 (Québec)**, à la **LPRPDE (Canada)** et au **RGPD (UE)** pour les utilisateurs européens.

---

## §1 — Responsable du traitement

[NOM DE L'ENTITÉ LÉGALE]
[ADRESSE]
Québec, Canada

Courriel du responsable : [privacy@epiceriesfaciles.com]

---

## §2 — Données collectées

### 2.1 Données fournies par l'utilisateur
| Donnée | Moment | Obligatoire |
|---|---|---|
| Adresse courriel | Création de compte | Oui |
| Préférences de langue | Création de compte | Non |
| Prix cible (watchlist) | Ajout au suivi | Non |

### 2.2 Données collectées automatiquement
| Donnée | Finalité | Conservation |
|---|---|---|
| Adresse IP (hachée SHA-256) | Sécurité, consentements Loi 25 | 12 mois |
| User-Agent | Sécurité, compatibilité | 12 mois |
| Clics sortants (anonymisés) | Analytics B2B | 24 mois |
| Cookies de session | Authentification | Durée session |

### 2.3 Données de géolocalisation
La géolocalisation est **optionnelle** et utilisée uniquement pour afficher les magasins à proximité. Elle n'est jamais stockée sans consentement explicite.

---

## §3 — Finalités et bases légales

| Finalité | Base légale (Loi 25) | Base légale (RGPD) |
|---|---|---|
| Fourniture du service | Exécution du contrat | Art. 6(1)(b) |
| Alertes de prix | Consentement | Art. 6(1)(a) |
| Analytics agrégées | Intérêt légitime | Art. 6(1)(f) |
| Publicité ciblée | Consentement | Art. 6(1)(a) |
| Obligations légales | Obligation légale | Art. 6(1)(c) |

---

## §4 — Conservation des données

| Données | Durée de conservation |
|---|---|
| Compte utilisateur | Jusqu'à suppression + 30 jours |
| Historique de prix (anonymisé) | Indéfini (aucune donnée personnelle) |
| Clics sortants | 24 mois, puis anonymisation complète |
| Logs de consentement | 5 ans (obligation légale Loi 25) |
| Logs de sécurité | 12 mois |

---

## §5 — Tiers et sous-traitants

| Fournisseur | Rôle | Localisation | Garantie |
|---|---|---|---|
| Supabase | Base de données, Auth | USA (AWS) | DPA signé, clauses types UE |
| Vercel | Infrastructure, CDN | USA | DPA signé, clauses types UE |
| Resend | Envoi de courriels | USA | DPA signé |
| Stripe | Paiements (Phase 2) | USA | PCI-DSS, DPA signé |

Aucune donnée personnelle n'est vendue à des tiers.

---

## §6 — Vos droits

Conformément à la **Loi 25** et au **RGPD**, vous disposez des droits suivants :

- **Accès** : Obtenir une copie de vos données personnelles
- **Rectification** : Corriger des données inexactes
- **Suppression** : Demander l'effacement de vos données (droit à l'oubli)
- **Portabilité** : Recevoir vos données dans un format structuré
- **Opposition** : Vous opposer au traitement à des fins marketing
- **Retrait du consentement** : À tout moment, sans effet rétroactif

**Comment exercer vos droits :** Via la page `/account` ou par courriel à [privacy@epiceriesfaciles.com].

Délai de réponse : **30 jours**.

---

## §7 — Transferts internationaux

Les données sont hébergées aux États-Unis (Supabase sur AWS). Ce transfert est encadré par des **Clauses Contractuelles Types (CCT)** approuvées par la Commission européenne et conformes aux exigences de la Loi 25.

---

## §8 — Sécurité

Mesures de sécurité mises en place :
- Chiffrement en transit (TLS 1.3)
- Chiffrement au repos (AES-256 via Supabase)
- Row Level Security (RLS) Supabase
- IP jamais stockée en clair (hachage SHA-256)
- Authentification par lien magique (pas de mot de passe)
- Accès interne limité au principe du moindre privilège

---

## §9 — Cookies

Voir notre **Politique de Cookies** séparée pour le détail des cookies utilisés et la gestion des consentements.

---

## §10 — Modifications

Toute modification substantielle sera notifiée par courriel **30 jours à l'avance**. La version courante est toujours disponible à `/legal/privacy`.

---

## §11 — Contact et plainte

**Responsable de la protection des renseignements personnels :**
[privacy@epiceriesfaciles.com]

**Commission d'accès à l'information du Québec (CAI) :**
[www.cai.gouv.qc.ca](https://www.cai.gouv.qc.ca)
Vous avez le droit de déposer une plainte auprès de la CAI si vous estimez que vos droits ne sont pas respectés.
