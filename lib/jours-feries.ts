export interface JourFerie {
  slug: string;
  nom: string;          // "Ascension"
  nomComplet: string;   // "Jeudi de l'Ascension"
  dateLabel: string;    // "jeudi 14 mai 2026"
  date2026: string;     // "2026-05-14" (ISO)
  date2027: string;     // "2027-XX-XX" (ISO)
  fixedLabel?: string;  // "1er mai chaque année" pour jours fixes
  emoji: string;
  description: string;  // Texte SEO court pour la page
  faq: { q: string; a: string }[];
}

export const JOURS_FERIES: JourFerie[] = [
  {
    slug: "jour-de-lan",
    nom: "Jour de l'An",
    nomComplet: "Jour de l'An — 1er janvier",
    dateLabel: "jeudi 1er janvier 2026",
    date2026: "2026-01-01",
    date2027: "2027-01-01",
    fixedLabel: "1er janvier chaque année",
    emoji: "🎆",
    description:
      "Le 1er janvier, toutes les pharmacies habituelles sont fermées. Une pharmacie de garde assure la permanence dans chaque secteur. Retrouvez la liste complète par ville.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le 1er janvier ?",
        a: "Non, la quasi-totalité des pharmacies est fermée le 1er janvier. Une pharmacie de garde par secteur assure la permanence 24h/24. Appelez le 3237 pour connaître celle de votre secteur.",
      },
      {
        q: "Comment trouver une pharmacie ouverte le jour de l'An ?",
        a: "Recherchez votre ville sur notre site ou appelez le 3237 (service de permanence des soins). Vous pouvez aussi consulter le site de votre Conseil départemental de l'Ordre des Pharmaciens.",
      },
      {
        q: "La pharmacie de garde est-elle ouverte toute la nuit du 31 décembre au 1er janvier ?",
        a: "Oui, la pharmacie de garde assure une permanence continue du 31 décembre au soir jusqu'au 2 janvier matin. En cas d'urgence médicale, appelez le 15 (SAMU).",
      },
    ],
  },
  {
    slug: "lundi-de-paques",
    nom: "Lundi de Pâques",
    nomComplet: "Lundi de Pâques",
    dateLabel: "lundi 6 avril 2026",
    date2026: "2026-04-06",
    date2027: "2027-03-29",
    emoji: "🐣",
    description:
      "Le lundi de Pâques est férié en France. Les pharmacies habituelles sont fermées. Une pharmacie de garde assure la permanence. Trouvez la vôtre par ville.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le lundi de Pâques ?",
        a: "Non, le lundi de Pâques est un jour férié. Les pharmacies habituelles sont fermées. Seule la pharmacie de garde de votre secteur est ouverte.",
      },
      {
        q: "Comment savoir quelle pharmacie est de garde le lundi de Pâques ?",
        a: "Recherchez votre ville sur notre site, appelez le 3237 ou consultez l'affichage sur la porte de votre pharmacie habituelle.",
      },
      {
        q: "Y a-t-il une pharmacie ouverte tout le week-end de Pâques ?",
        a: "Oui, une pharmacie de garde assure la permanence du samedi au lundi de Pâques inclus. Les horaires peuvent être réduits — vérifiez au 3237.",
      },
    ],
  },
  {
    slug: "1er-mai",
    nom: "1er Mai",
    nomComplet: "Fête du Travail — 1er mai",
    dateLabel: "vendredi 1er mai 2026",
    date2026: "2026-05-01",
    date2027: "2027-05-01",
    fixedLabel: "1er mai chaque année",
    emoji: "🌿",
    description:
      "Le 1er mai, toutes les pharmacies habituelles sont fermées pour la Fête du Travail. Une pharmacie de garde reste ouverte dans chaque secteur. Trouvez-la par ville.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le 1er mai ?",
        a: "Non, le 1er mai est le seul jour férié où le travail est interdit par la loi. Seule la pharmacie de garde est ouverte dans votre secteur.",
      },
      {
        q: "Comment trouver une pharmacie ouverte le 1er mai ?",
        a: "Entrez votre ville dans la recherche ci-dessus ou appelez le 3237. La pharmacie de garde peut avoir des horaires réduits.",
      },
      {
        q: "Peut-on aller chercher une ordonnance le 1er mai ?",
        a: "Oui, la pharmacie de garde peut délivrer les médicaments sur ordonnance urgents. En cas d'urgence médicale, appelez le 15 (SAMU).",
      },
    ],
  },
  {
    slug: "8-mai",
    nom: "8 Mai",
    nomComplet: "Victoire 1945 — 8 mai",
    dateLabel: "vendredi 8 mai 2026",
    date2026: "2026-05-08",
    date2027: "2027-05-08",
    fixedLabel: "8 mai chaque année",
    emoji: "🕊️",
    description:
      "Le 8 mai commémore la Victoire de 1945. Jour férié en France, les pharmacies habituelles sont fermées. Retrouvez la pharmacie de garde ouverte près de chez vous.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le 8 mai ?",
        a: "Non, le 8 mai est férié. Les pharmacies habituelles ferment. Une pharmacie de garde par secteur reste ouverte — trouvez-la sur cette page ou au 3237.",
      },
      {
        q: "Le 8 mai tombe un vendredi en 2026 — y a-t-il un pont ?",
        a: "Oui, le pont du 8 mai 2026 s'étend du jeudi 7 au dimanche 10 mai. Les pharmacies de garde assurent la permanence tout le week-end prolongé.",
      },
      {
        q: "Comment avoir des médicaments en urgence le 8 mai ?",
        a: "Appelez le 3237 pour connaître la pharmacie de garde la plus proche, ou utilisez notre recherche par ville. Pour les urgences médicales : 15 (SAMU).",
      },
    ],
  },
  {
    slug: "ascension",
    nom: "Ascension",
    nomComplet: "Jeudi de l'Ascension",
    dateLabel: "jeudi 14 mai 2026",
    date2026: "2026-05-14",
    date2027: "2027-05-13",
    emoji: "✝️",
    description:
      "L'Ascension tombe un jeudi — souvent suivi d'un pont le vendredi. Les pharmacies habituelles sont fermées. Trouvez la pharmacie de garde ouverte près de chez vous.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le jour de l'Ascension ?",
        a: "Non, l'Ascension est un jour férié. Seule la pharmacie de garde de votre secteur est ouverte. En 2026, l'Ascension a lieu le jeudi 14 mai.",
      },
      {
        q: "Y a-t-il un pont de l'Ascension en 2026 ?",
        a: "Oui — l'Ascension tombant un jeudi 14 mai 2026, beaucoup de personnes font le pont le vendredi 15 mai. Les pharmacies de garde couvrent tout le week-end prolongé.",
      },
      {
        q: "Comment trouver une pharmacie ouverte pendant le pont de l'Ascension ?",
        a: "Utilisez notre recherche par ville ou appelez le 3237. La permanence est assurée du jeudi au dimanche inclus.",
      },
    ],
  },
  {
    slug: "pentecote",
    nom: "Pentecôte",
    nomComplet: "Lundi de Pentecôte",
    dateLabel: "lundi 25 mai 2026",
    date2026: "2026-05-25",
    date2027: "2027-05-24",
    emoji: "🕊️",
    description:
      "Le lundi de Pentecôte est férié en France. Les pharmacies habituelles ferment. Une pharmacie de garde assure la permanence dans chaque secteur.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le lundi de Pentecôte ?",
        a: "Non, le lundi de Pentecôte est un jour férié. En 2026, il tombe le 25 mai. Seule la pharmacie de garde de votre secteur est ouverte.",
      },
      {
        q: "Comment trouver une pharmacie le weekend de Pentecôte ?",
        a: "Recherchez votre ville sur notre site ou appelez le 3237. La permanence est assurée tout le week-end de Pentecôte.",
      },
      {
        q: "La journée de solidarité est-elle liée à la Pentecôte ?",
        a: "Historiquement oui — le lundi de Pentecôte était la journée de solidarité, mais les entreprises peuvent désormais choisir un autre jour. Le statut de jour férié reste inchangé.",
      },
    ],
  },
  {
    slug: "14-juillet",
    nom: "14 Juillet",
    nomComplet: "Fête Nationale — 14 juillet",
    dateLabel: "mardi 14 juillet 2026",
    date2026: "2026-07-14",
    date2027: "2027-07-14",
    fixedLabel: "14 juillet chaque année",
    emoji: "🎇",
    description:
      "Le 14 juillet, Fête Nationale française, est un jour férié. Les pharmacies habituelles sont fermées. Retrouvez la pharmacie de garde ouverte dans votre ville.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le 14 juillet ?",
        a: "Non, le 14 juillet est férié. Seule la pharmacie de garde est ouverte dans votre secteur. Appelez le 3237 ou recherchez votre ville sur cette page.",
      },
      {
        q: "Peut-on se faire soigner le 14 juillet en cas d'urgence ?",
        a: "Oui — la pharmacie de garde est ouverte, les urgences hospitalières sont ouvertes 24h/24. Pour toute urgence médicale : 15 (SAMU), 18 (Pompiers) ou 112.",
      },
      {
        q: "Y a-t-il un pont le 14 juillet 2026 ?",
        a: "En 2026, le 14 juillet tombe un mardi. Certains feront le pont le lundi 13 juillet. Les pharmacies de garde couvrent tout ce weekend prolongé.",
      },
    ],
  },
  {
    slug: "15-aout",
    nom: "15 Août",
    nomComplet: "Assomption — 15 août",
    dateLabel: "samedi 15 août 2026",
    date2026: "2026-08-15",
    date2027: "2027-08-15",
    fixedLabel: "15 août chaque année",
    emoji: "☀️",
    description:
      "Le 15 août (Assomption) est férié en France. En plein été, beaucoup de pharmacies sont en congés — la permanence de garde est encore plus importante. Trouvez-la par ville.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le 15 août ?",
        a: "Non, le 15 août est férié. En été, beaucoup de pharmacies sont également en vacances — il est particulièrement important de vérifier la pharmacie de garde au 3237.",
      },
      {
        q: "Comment trouver une pharmacie en août pendant les vacances ?",
        a: "Utilisez notre recherche par ville ou appelez le 3237. En été, la pharmacie de garde peut être plus éloignée que d'habitude car certaines pharmacies sont fermées pour congés.",
      },
      {
        q: "Le 15 août est-il toujours un jour férié en France ?",
        a: "Oui, le 15 août (Assomption de Marie) est l'un des 11 jours fériés officiels en France, quelle que soit la religion du salarié.",
      },
    ],
  },
  {
    slug: "toussaint",
    nom: "Toussaint",
    nomComplet: "Toussaint — 1er novembre",
    dateLabel: "dimanche 1er novembre 2026",
    date2026: "2026-11-01",
    date2027: "2027-11-01",
    fixedLabel: "1er novembre chaque année",
    emoji: "🕯️",
    description:
      "La Toussaint (1er novembre) est un jour férié. Les pharmacies habituelles sont fermées. Une pharmacie de garde assure la permanence dans chaque secteur.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le 1er novembre (Toussaint) ?",
        a: "Non, la Toussaint est un jour férié. Seule la pharmacie de garde est ouverte dans votre secteur. En 2026, le 1er novembre tombe un dimanche.",
      },
      {
        q: "Comment trouver une pharmacie ouverte à la Toussaint ?",
        a: "Recherchez votre ville sur cette page ou appelez le 3237. La pharmacie de garde peut avoir des horaires réduits le dimanche.",
      },
    ],
  },
  {
    slug: "11-novembre",
    nom: "11 Novembre",
    nomComplet: "Armistice — 11 novembre",
    dateLabel: "mercredi 11 novembre 2026",
    date2026: "2026-11-11",
    date2027: "2027-11-11",
    fixedLabel: "11 novembre chaque année",
    emoji: "🎗️",
    description:
      "Le 11 novembre commémore l'Armistice de 1918. Jour férié en France, les pharmacies habituelles sont fermées. Trouvez la pharmacie de garde ouverte près de chez vous.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le 11 novembre ?",
        a: "Non, le 11 novembre est un jour férié. Seule la pharmacie de garde de votre secteur est ouverte. Appelez le 3237 ou recherchez votre ville sur cette page.",
      },
      {
        q: "Comment avoir un médicament en urgence le 11 novembre ?",
        a: "La pharmacie de garde peut délivrer les médicaments urgents sur ordonnance. Pour les urgences médicales, composez le 15 (SAMU).",
      },
    ],
  },
  {
    slug: "noel",
    nom: "Noël",
    nomComplet: "Noël — 25 décembre",
    dateLabel: "vendredi 25 décembre 2026",
    date2026: "2026-12-25",
    date2027: "2027-12-25",
    fixedLabel: "25 décembre chaque année",
    emoji: "🎄",
    description:
      "Le 25 décembre, toutes les pharmacies habituelles sont fermées pour Noël. Une pharmacie de garde assure la permanence dans chaque ville. Trouvez-la rapidement.",
    faq: [
      {
        q: "Les pharmacies sont-elles ouvertes le jour de Noël ?",
        a: "Non, le 25 décembre est férié. Seule la pharmacie de garde est ouverte. En 2026, Noël tombe un vendredi — pensez aussi à vérifier le 24 au soir.",
      },
      {
        q: "Y a-t-il une pharmacie ouverte la nuit de Noël ?",
        a: "Oui, une pharmacie de garde assure la permanence la nuit du 24 au 25 décembre. Appelez le 3237 pour connaître ses coordonnées.",
      },
      {
        q: "Comment avoir des médicaments en urgence à Noël ?",
        a: "Appelez le 3237 ou utilisez notre recherche. Pour les urgences médicales graves : 15 (SAMU), 18 (Pompiers), 112.",
      },
    ],
  },
];

// Villes les plus populaires pour la grille de liens rapides
export const TOP_VILLES = [
  { nom: "Paris", slug: "paris" },
  { nom: "Marseille", slug: "marseille" },
  { nom: "Lyon", slug: "lyon" },
  { nom: "Toulouse", slug: "toulouse" },
  { nom: "Nice", slug: "nice" },
  { nom: "Nantes", slug: "nantes" },
  { nom: "Montpellier", slug: "montpellier" },
  { nom: "Strasbourg", slug: "strasbourg" },
  { nom: "Bordeaux", slug: "bordeaux" },
  { nom: "Lille", slug: "lille" },
  { nom: "Rennes", slug: "rennes" },
  { nom: "Reims", slug: "reims" },
  { nom: "Le Havre", slug: "le-havre" },
  { nom: "Saint-Étienne", slug: "saint-etienne" },
  { nom: "Toulon", slug: "toulon" },
  { nom: "Grenoble", slug: "grenoble" },
  { nom: "Dijon", slug: "dijon" },
  { nom: "Angers", slug: "angers" },
  { nom: "Nîmes", slug: "nimes" },
  { nom: "Aix-en-Provence", slug: "aix-en-provence" },
  { nom: "Clermont-Ferrand", slug: "clermont-ferrand" },
  { nom: "Tours", slug: "tours" },
  { nom: "Brest", slug: "brest" },
  { nom: "Amiens", slug: "amiens" },
  { nom: "Limoges", slug: "limoges" },
  { nom: "Perpignan", slug: "perpignan" },
  { nom: "Metz", slug: "metz" },
  { nom: "Besançon", slug: "besancon" },
  { nom: "Rouen", slug: "rouen" },
  { nom: "Caen", slug: "caen" },
];

export function getJourFerieBySlug(slug: string): JourFerie | undefined {
  return JOURS_FERIES.find((j) => j.slug === slug);
}
