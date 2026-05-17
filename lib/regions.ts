export interface Region {
  slug: string;
  nom: string;
  departements: string[];
  villes: { nom: string; slug: string }[];
}

export const REGIONS: Region[] = [
  {
    slug: "ile-de-france",
    nom: "Île-de-France",
    departements: ["75", "77", "78", "91", "92", "93", "94", "95"],
    villes: [
      { nom: "Paris", slug: "paris" },
      { nom: "Versailles", slug: "versailles" },
      { nom: "Boulogne-Billancourt", slug: "boulogne-billancourt" },
      { nom: "Montreuil", slug: "montreuil" },
      { nom: "Argenteuil", slug: "argenteuil" },
      { nom: "Créteil", slug: "creteil" },
      { nom: "Nanterre", slug: "nanterre" },
      { nom: "Saint-Denis", slug: "saint-denis" },
    ],
  },
  {
    slug: "auvergne-rhone-alpes",
    nom: "Auvergne-Rhône-Alpes",
    departements: ["01", "03", "07", "15", "26", "38", "42", "43", "63", "69", "73", "74"],
    villes: [
      { nom: "Lyon", slug: "lyon" },
      { nom: "Grenoble", slug: "grenoble" },
      { nom: "Saint-Étienne", slug: "saint-etienne" },
      { nom: "Clermont-Ferrand", slug: "clermont-ferrand" },
      { nom: "Annecy", slug: "annecy" },
      { nom: "Villeurbanne", slug: "villeurbanne" },
      { nom: "Valence", slug: "valence" },
      { nom: "Chambéry", slug: "chambery" },
    ],
  },
  {
    slug: "bourgogne-franche-comte",
    nom: "Bourgogne-Franche-Comté",
    departements: ["21", "25", "39", "58", "70", "71", "89", "90"],
    villes: [
      { nom: "Dijon", slug: "dijon" },
      { nom: "Besançon", slug: "besancon" },
      { nom: "Chalon-sur-Saône", slug: "chalon-sur-saone" },
      { nom: "Auxerre", slug: "auxerre" },
      { nom: "Belfort", slug: "belfort" },
      { nom: "Mâcon", slug: "macon" },
    ],
  },
  {
    slug: "bretagne",
    nom: "Bretagne",
    departements: ["22", "29", "35", "56"],
    villes: [
      { nom: "Rennes", slug: "rennes" },
      { nom: "Brest", slug: "brest" },
      { nom: "Quimper", slug: "quimper" },
      { nom: "Lorient", slug: "lorient" },
      { nom: "Vannes", slug: "vannes" },
      { nom: "Saint-Brieuc", slug: "saint-brieuc" },
    ],
  },
  {
    slug: "centre-val-de-loire",
    nom: "Centre-Val de Loire",
    departements: ["18", "28", "36", "37", "41", "45"],
    villes: [
      { nom: "Tours", slug: "tours" },
      { nom: "Orléans", slug: "orleans" },
      { nom: "Bourges", slug: "bourges" },
      { nom: "Chartres", slug: "chartres" },
      { nom: "Blois", slug: "blois" },
      { nom: "Châteauroux", slug: "chateauroux" },
    ],
  },
  {
    slug: "grand-est",
    nom: "Grand Est",
    departements: ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
    villes: [
      { nom: "Strasbourg", slug: "strasbourg" },
      { nom: "Reims", slug: "reims" },
      { nom: "Metz", slug: "metz" },
      { nom: "Mulhouse", slug: "mulhouse" },
      { nom: "Nancy", slug: "nancy" },
      { nom: "Colmar", slug: "colmar" },
      { nom: "Charleville-Mézières", slug: "charleville-mezieres" },
    ],
  },
  {
    slug: "hauts-de-france",
    nom: "Hauts-de-France",
    departements: ["02", "59", "60", "62", "80"],
    villes: [
      { nom: "Lille", slug: "lille" },
      { nom: "Amiens", slug: "amiens" },
      { nom: "Roubaix", slug: "roubaix" },
      { nom: "Dunkerque", slug: "dunkerque" },
      { nom: "Calais", slug: "calais" },
      { nom: "Boulogne-sur-Mer", slug: "boulogne-sur-mer" },
    ],
  },
  {
    slug: "normandie",
    nom: "Normandie",
    departements: ["14", "27", "50", "61", "76"],
    villes: [
      { nom: "Rouen", slug: "rouen" },
      { nom: "Caen", slug: "caen" },
      { nom: "Le Havre", slug: "le-havre" },
      { nom: "Évreux", slug: "evreux" },
      { nom: "Cherbourg", slug: "cherbourg-en-cotentin" },
      { nom: "Alençon", slug: "alencon" },
    ],
  },
  {
    slug: "nouvelle-aquitaine",
    nom: "Nouvelle-Aquitaine",
    departements: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"],
    villes: [
      { nom: "Bordeaux", slug: "bordeaux" },
      { nom: "Limoges", slug: "limoges" },
      { nom: "Poitiers", slug: "poitiers" },
      { nom: "La Rochelle", slug: "la-rochelle" },
      { nom: "Pau", slug: "pau" },
      { nom: "Bayonne", slug: "bayonne" },
      { nom: "Angoulême", slug: "angouleme" },
      { nom: "Périgueux", slug: "perigueux" },
    ],
  },
  {
    slug: "occitanie",
    nom: "Occitanie",
    departements: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"],
    villes: [
      { nom: "Toulouse", slug: "toulouse" },
      { nom: "Montpellier", slug: "montpellier" },
      { nom: "Nîmes", slug: "nimes" },
      { nom: "Perpignan", slug: "perpignan" },
      { nom: "Béziers", slug: "beziers" },
      { nom: "Albi", slug: "albi" },
      { nom: "Narbonne", slug: "narbonne" },
      { nom: "Carcassonne", slug: "carcassonne" },
    ],
  },
  {
    slug: "pays-de-la-loire",
    nom: "Pays de la Loire",
    departements: ["44", "49", "53", "72", "85"],
    villes: [
      { nom: "Nantes", slug: "nantes" },
      { nom: "Angers", slug: "angers" },
      { nom: "Le Mans", slug: "le-mans" },
      { nom: "Saint-Nazaire", slug: "saint-nazaire" },
      { nom: "La Roche-sur-Yon", slug: "la-roche-sur-yon" },
      { nom: "Laval", slug: "laval" },
    ],
  },
  {
    slug: "provence-alpes-cote-d-azur",
    nom: "Provence-Alpes-Côte d'Azur",
    departements: ["04", "05", "06", "13", "83", "84"],
    villes: [
      { nom: "Marseille", slug: "marseille" },
      { nom: "Nice", slug: "nice" },
      { nom: "Toulon", slug: "toulon" },
      { nom: "Aix-en-Provence", slug: "aix-en-provence" },
      { nom: "Avignon", slug: "avignon" },
      { nom: "Cannes", slug: "cannes" },
      { nom: "Antibes", slug: "antibes" },
    ],
  },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}
