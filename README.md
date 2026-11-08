# Clinic Fees Manager

Nom du Projet : Gestionnaire d'Honoraires Cliniques (PWA)
Objectif : Créer une application mobile (PWA) sécurisée pour le suivi des honoraires médicaux en cliniques privées, avec synchronisation sur tous mes appareils (iPhone 14, S22, PC).
1. Sécurité & Authentification :
1. Sécurité & Authentification :
•	Page de login obligatoire. Mot de passe unique : [Sareli@1975].
•	Session persistante sur mes 2 mobiles Samsung S22 et toutes les versions supérieures et IPhone 14 et toutes les versions supérieures  (ne pas se reconnecter à chaque ouverture).
2. Base de Données des Cliniques :
•	Menu déroulant de sélection : "Hôpital Privé de Salé AKDITAL", "Clinique AKDITAL AGDAL", "Polyclinique AGDAL", "Polyclinique de RABAT".
•	Ajouter une option "AUTRES CLINIQUES" permettant de saisir manuellement un nouveau nom qui s'ajoutera définitivement à la liste.
3. Fiche Patient & Actes :
•	Champs : Nom du Patient, Numéro de Chambre, Étage, Date de passage (calendrier).
•	Liste d'Actes Standards (avec calcul automatique du montant) :
o	Consultation au lit (400 dh)
o	Fibroscopie bronchique (2000 dh)
o	Ponction pleurale (800 dh)
o	Ponction biopsie pleurale (1500 dh)
o	Drainage pneumothorax (2000 dh)
•	Possibilité d'ajouter un montant "Libre" pour d'autres actes.
•	Bouton "+ Ajouter un passage" pour un patient déjà enregistré (pour cumuler plusieurs consultations lors d'une même hospitalisation).
•	Bouton supprimer pour chaque patient programmé ou acte programmé mais non réalisé 
4. Gestion des Statuts (Code Couleur) :
•	🔴 EN ATTENTE: Acte effectué, dossier déposé en comptabilité paiement clinique/mutuelle en cours. 
•	🟢 PAYÉ : Honoraires reçus.
•	Un bouton "Archiver" pour déplacer les dossiers payés dans un onglet "Archives" (ne jamais supprimer pour historique en cas de litige).
5. Design & Ergonomie :
•	Thème Moderne/Médical : Couleurs Teal (#0f766e) et Gris ardoise.
•	Dashboard : Afficher en bas de l'écran le cumul des honoraires "En attente" et "En instance".
•	Entièrement Responsive : Boutons larges pour usage à une main sur iPhone14/S22.
6. Fonctionnalités Web App (PWA) :
•	Configurer le manifest et les icônes pour l'installation sur l'écran d'accueil.
•	Nom court de l'icône : "Honoraires".
•	Image de l'icone : argent et stethoscope

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://honoraires-sync.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5553310c-6ea1-4380-ac80-38ab1afe2454).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
