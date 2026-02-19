import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase-server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as Record<string, unknown>;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const nameTrim = name.trim();
    const emailTrim = email.trim().toLowerCase();
    const subjectTrim = subject.trim();
    const messageTrim = message.trim();

    if (!nameTrim) {
      return NextResponse.json(
        { success: false, error: "Le nom est requis." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(emailTrim)) {
      return NextResponse.json(
        { success: false, error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    if (!subjectTrim) {
      return NextResponse.json(
        { success: false, error: "Le sujet est requis." },
        { status: 400 }
      );
    }

    if (messageTrim.length < MIN_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Le message doit contenir au moins ${MIN_MESSAGE_LENGTH} caractères.`,
        },
        { status: 400 }
      );
    }

    const contactEmail = process.env.CONTACT_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;
    const supabase = createServerClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Configuration serveur indisponible." },
        { status: 503 }
      );
    }

    const { error: insertError } = await supabase.from("contact_messages").insert({
      name: nameTrim,
      email: emailTrim,
      subject: subjectTrim,
      message: messageTrim,
    });

    if (insertError) {
      console.error("Supabase contact_messages insert:", insertError);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'enregistrement du message." },
        { status: 500 }
      );
    }

    let emailSent = false;
    if (resendKey && contactEmail) {
      const resend = new Resend(resendKey);
      const { error: emailError } = await resend.emails.send({
        from: "Pharmacies de Garde <onboarding@resend.dev>",
        to: contactEmail,
        replyTo: emailTrim,
        subject: `[Contact] ${subjectTrim}`,
        html: `
          <p><strong>Nom :</strong> ${escapeHtml(nameTrim)}</p>
          <p><strong>Email :</strong> ${escapeHtml(emailTrim)}</p>
          <p><strong>Sujet :</strong> ${escapeHtml(subjectTrim)}</p>
          <p><strong>Message :</strong></p>
          <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(messageTrim)}</pre>
        `,
      });
      if (emailError) {
        console.error("Resend email error:", emailError);
      } else {
        emailSent = true;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Votre message a bien été envoyé.",
      emailSent,
    });
  } catch (e) {
    console.error("POST /api/contact:", e);
    return NextResponse.json(
      { success: false, error: "Une erreur inattendue s'est produite." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
