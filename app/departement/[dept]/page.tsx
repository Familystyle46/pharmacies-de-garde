import type { Metadata } from "next";
import Link from "next/link";
import {
  getVillesByDepartement,
  getTopDepartementsCodes,
} from "@/lib/pharmacies";
import { getDepartementByCode, TOP_20_DEPARTEMENTS } from "@/lib/departements";
import { Breadcrumb } from "@/components/Breadcrumb";

interface PageProps {
  params: Promise<{ dept: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { dept } = await params;
  const departement = getDepartementByCode(dept);
  const nom = departement?.nom ?? dept;
  const title = `Pharmacies de Garde en ${nom} (${dept}) | Liste complète`;
  const description = `Liste des pharmacies de garde dans le département ${nom} (${dept}). Trouvez une pharmacie ouverte par ville.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export async function generateStaticParams() {
  try {
    const codes = await getTopDepartementsCodes();
    if (codes.length > 0) {
      return codes.map((dept) => ({ dept }));
    }
  } catch {
    /* fallback */
  }
  return TOP_20_DEPARTEMENTS.map((dept) => ({ dept }));
}

export default async function DepartementPage({ params }: PageProps) {
  const { dept } = await params;
  const departement = getDepartementByCode(dept);
  const villes = await getVillesByDepartement(dept);

  const nomDept = departement?.nom ?? dept;

  const breadcrumbItems = [
    { name: "Accueil", href: "/" },
    { name: `${nomDept} (${dept})`, href: undefined },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div
        className="py-12 px-4"
        style={{
          background: "linear-gradient(180deg, #14532d 0%, #166534 50%, #16a34a 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Pharmacies de Garde en {nomDept}
          </h1>
          <p className="text-white/90 text-lg">
            Liste des villes du département {dept} avec pharmacies de garde
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {villes.length > 0 ? (
          <div className="space-y-3">
            {villes.map((v) => (
              <Link
                key={v.ville_slug}
                href={`/pharmacie-de-garde/${v.ville_slug}`}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md border border-gray-100 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {v.ville}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {v.nb_pharmacies} pharmacie{v.nb_pharmacies !== 1 ? "s" : ""}
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800 text-center">
            Aucune pharmacie de garde enregistrée pour le département {dept}. Essayez une autre recherche.
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-hover transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
