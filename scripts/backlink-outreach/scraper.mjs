/**
 * Backlink Outreach — pharmacies-de-garde.net
 *
 * Pour chaque site dans sites.csv :
 *   1. Trouve la page de contact
 *   2. Remplit le formulaire avec un message personnalisé
 *   3. Soumet (ou simule en DRY_RUN=true)
 *
 * Usage :
 *   npm run dry-run   → simule, écrit dans results/dry-run.csv
 *   npm run submit    → soumet vraiment les formulaires
 */

import { PlaywrightCrawler, log } from "crawlee";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Configuration ────────────────────────────────────────────────────────────

const DRY_RUN = process.env.DRY_RUN !== "false"; // true par défaut
const DELAY_MS = 4000;        // délai entre chaque site (ms)
const MAX_CONTACT_DEPTH = 3;  // profondeur max pour trouver la page contact
const RESULTS_DIR = path.join(__dirname, "results");

/** Vos informations — à modifier avant de lancer */
const SENDER = {
  nom: "Thomas Durand",
  email: "contact@pharmacies-de-garde.net",
  organisation: "pharmacies-de-garde.net",
};

// ─── Message personnalisé ─────────────────────────────────────────────────────

function buildMessage(ville, villeSlug) {
  const url = villeSlug
    ? `https://pharmacies-de-garde.net/pharmacie-de-garde/${villeSlug}`
    : "https://pharmacies-de-garde.net";

  return `Bonjour,

Je me permets de vous contacter au sujet de notre service gratuit pharmacies-de-garde.net.

Notre site recense toutes les pharmacies de garde en France avec leurs adresses, numéros de téléphone et horaires, accessibles 24h/24 et 7j/7.

Nous avons notamment une page dédiée à ${ville} :
→ ${url}

Il nous semblerait très utile pour vos visiteurs que vous puissiez mentionner ce service dans votre rubrique "Informations pratiques", "Santé" ou "Urgences". Ce lien pourrait aider vos résidents et touristes à trouver rapidement une pharmacie ouverte en dehors des horaires habituels.

Notre service est entièrement gratuit et sans aucune contrepartie commerciale.

Merci de votre attention,
${SENDER.nom}
${SENDER.organisation}
${SENDER.email}`;
}

function buildSubject(ville) {
  return `Suggestion de lien utile — Pharmacie de garde à ${ville}`;
}

// ─── Détection des champs de formulaire ──────────────────────────────────────

const FIELD_SELECTORS = {
  name: [
    'input[name*="nom" i]:not([name*="prenom" i])',
    'input[name*="lastname" i]',
    'input[name*="name" i]:not([name*="first" i]):not([name*="user" i]):not([name*="user" i])',
    'input[name="name"]',            // Drupal
    'input[placeholder*="votre nom" i]',
    'input[placeholder*="nom complet" i]',
    'input[id*="nom" i]:not([id*="prenom" i])',
    'input[id*="name" i]:not([id*="first" i])',
  ],
  firstname: [
    'input[name*="prenom" i]',
    'input[name*="firstname" i]',
    'input[name*="first_name" i]',
    'input[placeholder*="prénom" i]',
  ],
  email: [
    'input[type="email"]',
    'input[name="mail"]',            // Drupal contact form
    'input[name*="email" i]',
    'input[name*="mail" i]',         // "mail", "e-mail", "votre_mail"…
    'input[name*="courriel" i]',
    'input[id*="email" i]',
    'input[id*="mail" i]',
    'input[autocomplete="email"]',
    'input[placeholder*="email" i]',
    'input[placeholder*="e-mail" i]',
    'input[placeholder*="courriel" i]',
    'input[placeholder*="@"]',       // champ contenant "@" dans le placeholder
  ],
  subject: [
    'input[name*="sujet" i]',
    'input[name*="subject" i]',
    'input[name*="objet" i]',
    'input[name*="titre" i]',
    'input[name="subject[0][value]"]', // Drupal
    'input[id*="subject" i]',
    'input[id*="sujet" i]',
    'input[placeholder*="sujet" i]',
    'input[placeholder*="objet" i]',
  ],
  message: [
    'textarea[name="message[0][value]"]', // Drupal
    'textarea[name*="message" i]',
    'textarea[name*="texte" i]',
    'textarea[name*="contenu" i]',
    'textarea[name*="description" i]',
    'textarea[name*="body" i]',
    'textarea[name*="comment" i]',
    'textarea[id*="message" i]',
    'textarea[id*="texte" i]',
    'textarea[id*="body" i]',
    'textarea',                      // fallback : première textarea visible
    // Certains forms simples utilisent input au lieu de textarea
    'input[name*="message" i]',
    'input[id*="message" i]',
    'input[name*="texte" i]',
    'input[name*="commentaire" i]',
  ],
  organisation: [
    'input[name*="societe" i]',
    'input[name*="organisation" i]',
    'input[name*="company" i]',
    'input[name*="entreprise" i]',
    'input[id*="organisation" i]',
    'input[id*="company" i]',
  ],
};

const CAPTCHA_SELECTORS = [
  ".g-recaptcha",
  ".h-captcha",
  "#cf-turnstile",
  ".cf-turnstile",
  'iframe[src*="recaptcha"]',
  'iframe[src*="hcaptcha"]',
  'iframe[src*="turnstile"]',
];

/** URLs qui indiquent une page contact */
const CONTACT_URL_PATTERNS = [
  /contact/i,
  /nous[- _]?contacter/i,
  /formulaire/i,
  /ecrire/i,
  /message/i,
];

/** Patterns à exclure — pages d'info, urgences, FAQ, etc. */
const CONTACT_URL_BLACKLIST = [
  /urgence/i,
  /panneau/i,
  /presse/i,
  /faq/i,
  /actualit/i,
  /annuaire/i,
  /repertoire/i,
  /organisation/i,   // ARS "organisation-et-contact" = page info
  /planning/i,
  /agenda/i,
];

/** Textes de liens qui indiquent une page contact */
const CONTACT_LINK_TEXTS = [
  "contact",
  "nous contacter",
  "contactez-nous",
  "formulaire",
  "écrire",
  "message",
  "contactez nous",
];

// ─── Résultats ────────────────────────────────────────────────────────────────

const results = [];

function saveResults() {
  if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const filename = DRY_RUN ? "dry-run.csv" : `submitted-${Date.now()}.csv`;
  const filepath = path.join(RESULTS_DIR, filename);
  const csv = stringify(results, {
    header: true,
    columns: ["url", "ville", "contact_page", "status", "detail", "message_preview"],
  });
  fs.writeFileSync(filepath, csv, "utf-8");
  log.info(`Résultats sauvegardés → ${filepath}`);
}

// ─── Helpers Playwright ───────────────────────────────────────────────────────

async function findContactPageUrl(page, baseUrl) {
  // 1. Cherche dans les liens de la page courante
  const links = await page.$$eval("a[href]", (anchors) =>
    anchors.map((a) => ({
      href: a.href,
      text: a.textContent?.trim().toLowerCase() ?? "",
    }))
  );

  for (const { href, text } of links) {
    if (!href.startsWith("http")) continue;
    try {
      const u = new URL(href);
      // Doit rester sur le même domaine
      if (!href.includes(new URL(baseUrl).hostname)) continue;
    } catch {
      continue;
    }
    const isContact =
      CONTACT_URL_PATTERNS.some((p) => p.test(href)) ||
      CONTACT_LINK_TEXTS.some((t) => text.includes(t));
    const isBlacklisted = CONTACT_URL_BLACKLIST.some((p) => p.test(href));
    if (isContact && !isBlacklisted) {
      return href;
    }
  }
  return null;
}

async function hasCaptcha(page) {
  for (const sel of CAPTCHA_SELECTORS) {
    const el = await page.$(sel);
    if (el) return true;
  }
  return false;
}

async function fillField(page, selectors, value) {
  // Pour les champs message : ajoute les éditeurs riches (contenteditable)
  const isMessageField = selectors === FIELD_SELECTORS.message;
  const allSelectors = isMessageField
    ? [...selectors, '[contenteditable="true"]', '.ql-editor', '.fr-element', '.cke_editable']
    : selectors;

  // Essaie d'abord dans le frame principal, puis dans les iframes
  const frames = [page, ...page.frames().filter((f) => f !== page.mainFrame())];

  for (const frame of frames) {
    for (const sel of allSelectors) {
      let el;
      try { el = await frame.$(sel); } catch { continue; }
      if (!el) continue;

      try {
        const tag = await el.evaluate((e) => e.tagName.toLowerCase());
        const type = await el.evaluate((e) => e.getAttribute("type") ?? "");
        const isContentEditable = await el.evaluate((e) => e.isContentEditable);

        // Ignore les champs cachés ou boutons
        if (type === "submit" || type === "button" || type === "hidden") continue;

        // Ignore les textareas invisibles (hauteur 0, souvent honeypots)
        if (tag === "textarea" || tag === "input") {
          const visible = await el.isVisible().catch(() => true);
          if (!visible) continue;
        }

        if (tag === "select") {
          const options = await el.$$eval("option", (opts) =>
            opts.map((o) => ({ value: o.value, text: o.textContent?.toLowerCase() ?? "" }))
          );
          const autre = options.find((o) =>
            o.text.includes("autre") || o.text.includes("other") || o.text.includes("général")
          );
          if (autre) await el.selectOption(autre.value);
          else if (options[1]) await el.selectOption(options[1].value);
        } else if (isContentEditable) {
          // Éditeur riche (CKEditor, Quill, Froala…)
          await el.click();
          await frame.waitForTimeout(300);
          await el.evaluate((e, v) => { e.textContent = v; }, value);
        } else {
          // Scroll + click pour activer le champ avant de le remplir
          await el.scrollIntoViewIfNeeded();
          await el.click({ timeout: 5000 }).catch(() => {});
          await frame.waitForTimeout(200);
          await el.fill(value, { timeout: 15000 });
        }
        return true;
      } catch {
        // Ce sélecteur a échoué, on essaie le suivant
        continue;
      }
    }
  }
  return false;
}

async function findSubmitButton(page) {
  const candidates = [
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Envoyer")',
    'button:has-text("Envoyer le message")',
    'button:has-text("Envoyer votre message")',
    'button:has-text("Soumettre")',
    'button:has-text("Valider")',
    'button:has-text("Send")',
    'button:has-text("Submit")',
    ".submit-btn",
    ".btn-submit",
    '[class*="submit"]',
  ];
  for (const sel of candidates) {
    try {
      const els = await page.$$(sel);
      for (const el of els) {
        const visible = await el.isVisible().catch(() => false);
        if (visible) return el;
      }
    } catch {}
  }
  return null;
}

// ─── Traitement d'un site ─────────────────────────────────────────────────────

async function processSite(page, siteUrl, ville, villeSlug) {
  const result = {
    url: siteUrl,
    ville,
    contact_page: "",
    status: "",
    detail: "",
    message_preview: buildMessage(ville, villeSlug).slice(0, 120) + "...",
  };

  try {
    log.info(`[${ville}] Chargement : ${siteUrl}`);
    await page.goto(siteUrl, { timeout: 20000, waitUntil: "domcontentloaded" });

    // Cherche la page contact depuis la homepage
    let contactUrl = await findContactPageUrl(page, siteUrl);

    if (!contactUrl) {
      // Essaie différents chemins de contact courants
      const tryUrls = [
        new URL("/contact", siteUrl).href,
        new URL("/nous-contacter", siteUrl).href,
        new URL("/contactez-nous", siteUrl).href,
        new URL("/contacter", siteUrl).href,
        new URL("/nous-ecrire", siteUrl).href,
        new URL("/ecrire", siteUrl).href,
        new URL("/formulaire-de-contact", siteUrl).href,
        new URL("/contact.html", siteUrl).href,
        new URL("/contact.php", siteUrl).href,
      ];
      for (const tryUrl of tryUrls) {
        try {
          const res = await page.goto(tryUrl, { timeout: 10000, waitUntil: "domcontentloaded" });
          if (res?.ok()) {
            contactUrl = tryUrl;
            break;
          }
        } catch {}
      }
    }

    if (!contactUrl) {
      result.status = "NO_CONTACT_PAGE";
      result.detail = "Page contact non trouvée";
      return result;
    }

    result.contact_page = contactUrl;
    log.info(`[${ville}] Page contact : ${contactUrl}`);

    if (contactUrl !== page.url()) {
      await page.goto(contactUrl, { timeout: 15000, waitUntil: "domcontentloaded" });
    }

    // Détection CAPTCHA
    if (await hasCaptcha(page)) {
      result.status = "CAPTCHA";
      result.detail = "CAPTCHA détecté — remplissage manuel requis";
      return result;
    }

    // Vérifie qu'il y a un formulaire de contact (pas juste un formulaire de recherche)
    const form = await page.$("form");
    if (!form) {
      result.status = "NO_FORM";
      result.detail = "Aucun formulaire trouvé sur la page contact";
      return result;
    }

    // Si le form a <3 champs visibles ET pas de textarea → probablement barre de recherche
    const formFieldCount = await page.$$eval(
      'form input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), form textarea',
      (els) => els.filter((e) => {
        const s = window.getComputedStyle(e);
        return s.display !== "none" && s.visibility !== "hidden" && e.offsetHeight > 0;
      }).length
    );
    const hasTextarea = (await page.$("form textarea")) !== null;
    if (formFieldCount < 3 && !hasTextarea) {
      result.status = "NO_FORM";
      result.detail = `Formulaire trop simple (${formFieldCount} champ(s) visible(s), pas de textarea) — page info sans formulaire de contact`;
      return result;
    }

    const message = buildMessage(ville, villeSlug);
    const subject = buildSubject(ville);

    // Remplissage des champs
    const filled = {
      nom: await fillField(page, FIELD_SELECTORS.name, SENDER.nom),
      prenom: await fillField(page, FIELD_SELECTORS.firstname, SENDER.nom.split(" ")[0]),
      email: await fillField(page, FIELD_SELECTORS.email, SENDER.email),
      sujet: await fillField(page, FIELD_SELECTORS.subject, subject),
      message: await fillField(page, FIELD_SELECTORS.message, message),
      org: await fillField(page, FIELD_SELECTORS.organisation, SENDER.organisation),
    };

    if (!filled.email || !filled.message) {
      // Vérifie si la page a des inputs visibles → vrai form ou page infos ?
      const inputCount = await page.$$eval(
        'form input:not([type="hidden"]):not([type="submit"]):not([type="button"]), form textarea',
        (els) => els.length
      );
      if (inputCount === 0) {
        result.status = "NO_FORM";
        result.detail = "Page contact sans champs de formulaire (page infos uniquement)";
      } else {
        result.status = "FIELDS_NOT_FOUND";
        result.detail = `${inputCount} champ(s) dans le form mais non reconnus — email:${filled.email} message:${filled.message}`;
      }
      return result;
    }

    if (DRY_RUN) {
      result.status = "DRY_RUN_OK";
      result.detail = `Formulaire rempli (simulation). Champs : ${Object.entries(filled).filter(([, v]) => v).map(([k]) => k).join(", ")}`;
      log.info(`[${ville}] [DRY RUN] Formulaire prêt — ${contactUrl}`);
      return result;
    }

    // Soumission réelle
    const submitBtn = await findSubmitButton(page);
    if (!submitBtn) {
      result.status = "NO_SUBMIT_BUTTON";
      result.detail = "Bouton de soumission non trouvé";
      return result;
    }

    await submitBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    // Essaie Playwright click, fallback JS click si le bouton est bloqué
    try {
      await submitBtn.click({ timeout: 8000 });
    } catch {
      await submitBtn.evaluate((el) => el.click());
    }
    await page.waitForTimeout(3000);

    // Vérifie confirmation (cherche des textes de succès communs)
    const pageText = await page.textContent("body") ?? "";
    const successKeywords = ["envoyé", "merci", "message reçu", "confirmation", "bien été envoyé", "thank you", "sent"];
    const isSuccess = successKeywords.some((kw) => pageText.toLowerCase().includes(kw));

    result.status = isSuccess ? "SUBMITTED_OK" : "SUBMITTED_UNCERTAIN";
    result.detail = isSuccess ? "Confirmation de réception détectée" : "Soumis mais confirmation incertaine";
    log.info(`[${ville}] ${result.status} — ${contactUrl}`);

  } catch (err) {
    result.status = "ERROR";
    result.detail = err.message?.slice(0, 200) ?? "Erreur inconnue";
    log.error(`[${ville}] Erreur : ${result.detail}`);
  }

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log.setLevel(log.LEVELS.INFO);

  // Lecture du CSV
  const csvPath = path.join(__dirname, process.env.SITES_FILE ?? "sites.csv");
  if (!fs.existsSync(csvPath)) {
    log.error(`Fichier sites.csv introuvable : ${csvPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(csvPath, "utf-8");
  const sites = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

  log.info(`Mode : ${DRY_RUN ? "DRY RUN (simulation)" : "SOUMISSION RÉELLE"}`);
  log.info(`Sites à traiter : ${sites.length}`);
  if (!DRY_RUN) {
    log.info("⚠️  Mode soumission réelle — les formulaires seront envoyés dans 5 secondes...");
    await new Promise((r) => setTimeout(r, 5000));
  }

  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: sites.length,
    maxConcurrency: 1,     // 1 à la fois pour être poli
    requestHandlerTimeoutSecs: 60,
    navigationTimeoutSecs: 30,
    launchContext: {
      launchOptions: {
        headless: true,
        ignoreHTTPSErrors: true,  // ignore les certs invalides
        args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
      },
    },
    preNavigationHooks: [
      async (_ctx, gotoOptions) => {
        gotoOptions.waitUntil = "domcontentloaded"; // moins strict que "load"
      },
    ],
    async requestHandler({ page, request }) {
      const { url, ville, ville_slug } = request.userData;
      const result = await processSite(page, url, ville, ville_slug);
      results.push(result);
      saveResults();
      // Délai poli entre les sites
      await page.waitForTimeout(DELAY_MS);
    },
    failedRequestHandler({ request, error }) {
      results.push({
        url: request.userData.url,
        ville: request.userData.ville,
        contact_page: "",
        status: "FAILED",
        detail: error.message?.slice(0, 200) ?? "Erreur crawler",
        message_preview: "",
      });
      saveResults();
    },
  });

  const requests = sites.map((row) => ({
    url: row.url?.startsWith("http") ? row.url : `https://${row.url}`,
    userData: {
      url: row.url?.startsWith("http") ? row.url : `https://${row.url}`,
      ville: row.ville,
      ville_slug: row.ville_slug,
    },
  }));

  await crawler.run(requests);

  // Résumé final
  const summary = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  log.info("─── Résumé ───────────────────────────────────");
  for (const [status, count] of Object.entries(summary)) {
    log.info(`  ${status.padEnd(25)} ${count}`);
  }
  log.info("──────────────────────────────────────────────");
  saveResults();
}

main().catch((err) => {
  log.error("Erreur fatale :", err);
  process.exit(1);
});
