# LTE Metrics

Ce projet permet de calculer les metrics d'éco-conception du projet LTE.

## Requirements

- Node 14+
- Npm

## Installation

```
npm install
```

## Commande

```
npm run metrics
```

## Metrics

Les metrics sont ensuite disponible dans le document [report.json](report.json), elles sont indexées par timestamp de lancement de la commande.

## Remerciements

Ce projet se base sur les outils :

- [Lighthouse](https://github.com/GoogleChrome/lighthouse)
- [GreenIT Analysis](https://github.com/cnumr/GreenIT-Analysis-cli)

Merci aux auteur·e·s de ces outils.

## Visualisation

### Svelte

#### Developing

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
