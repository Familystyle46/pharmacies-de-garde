import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez-nous — pharmacies-de-garde.net",
  robots: { index: false, follow: false },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Contact</h1>
      <p className="mb-8 text-gray-600">
        Une question ou une suggestion ? Envoyez-nous un message.
      </p>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">Envoyez-nous un message</h2>
        <ContactForm />
      </div>
    </div>
  );
}
