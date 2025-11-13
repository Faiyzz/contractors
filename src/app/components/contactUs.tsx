// components/ContactSection.tsx
"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, Phone as PhoneIcon , Mail as MailIcon } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    const [, part1, part2, part3] = match;
    return [part1, part2 && `-${part2}`, part3 && `-${part3}`]
      .filter(Boolean)
      .join("");
  };

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = e.target.value;
      if (key === "phone") {
        value = formatPhone(value);
        setPhoneTouched(true);
      }
      setForm((s) => ({ ...s, [key]: value }));
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
        throw new Error("Please fill in name, email, and message.");
      }
      if (phoneTouched && form.phone && form.phone.replace(/\D/g, "").length !== 10) {
        throw new Error("Please enter a valid 10-digit phone number.");
      }

      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to submit. Please try again.");
      }

      setSuccess("Thanks! Your message has been sent.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setPhoneTouched(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const phoneInvalid =
    phoneTouched && form.phone && form.phone.replace(/\D/g, "").length !== 10;

  return (
    <section id="contact" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* 2-col layout on lg: form (7) / details (5) */}
        <div className="grid grid-cols-1 gap-12 md:mt-6 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <h3 className="text-3xl font-semibold text-neutral-900">Contact Us</h3>

            <form className="mt-6 space-y-7" onSubmit={onSubmit}>
              <label className="block">
                <span className="text-sm text-neutral-700">Full Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={onChange("name")}
                  className="mt-2 block w-full bg-transparent border-0 border-b border-neutral-300 focus:border-yellow-400 focus:ring-0 placeholder:text-neutral-400"
                  placeholder="John Carter"
                />
              </label>

              <label className="block">
                <span className="text-sm text-neutral-700">E-mail</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={onChange("email")}
                  className="mt-2 block w-full bg-transparent border-0 border-b border-neutral-300 focus:border-yellow-400 focus:ring-0 placeholder:text-neutral-400"
                  placeholder="hi@green.com"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Phone</span>
                  {phoneInvalid && (
                    <span className="text-xs text-red-600">Enter a 10-digit number</span>
                  )}
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onChange("phone")}
                  className={`mt-2 block w-full bg-transparent border-0 border-b ${
                    phoneInvalid ? "border-red-400" : "border-neutral-300"
                  } focus:${
                    phoneInvalid ? "border-red-600" : "border-yellow-400"
                  } focus:ring-0 placeholder:text-neutral-400`}
                  placeholder="123-456-7890"
                />
              </label>

              <label className="block">
                <span className="text-sm text-neutral-700">Message</span>
                <textarea
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={onChange("message")}
                  className="mt-2 block w-full resize-none bg-transparent border-0 border-b border-neutral-300 focus:border-yellow-400 focus:ring-0 placeholder:text-neutral-400"
                  placeholder="How can we help?"
                />
              </label>

              {success && (
                <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-200">
                  {success}
                </div>
              )}
              {error && (
                <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800 border border-red-200">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-7 py-3 text-[15px] font-semibold text-neutral-900 shadow-sm transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Contact Us"}
                </button>
              </div>
            </form>

            {/* Socials */}
            <div className="mt-10 flex items-center gap-6 text-neutral-700">
              <Link
                href="https://www.facebook.com/profile.php?id=61578395345749"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition hover:text-yellow-400 hover:scale-110"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.instagram.com/ridgebackbuilders/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition hover:text-yellow-400 hover:scale-110"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.youtube.com/@RidgebackBuilt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="transition hover:text-yellow-400 hover:scale-110"
              >
                <Youtube className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.tiktok.com/@ridgebackbuilders?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="transition hover:text-yellow-400 hover:scale-110"
              >
                <SiTiktok className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <dl className="space-y-6 text-[15px]">
              {/* Phone with icon */}
              <div className="flex items-center gap-3">
                <dt className="sr-only">Phone</dt>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-yellow-50 border border-yellow-200">
                  <PhoneIcon className="h-4 w-4 text-yellow-600" />
                </span>
                <dd className="text-neutral-700 hover:text-yellow-500 transition">
                  <a href="tel:8139211717">(813) 921-1717</a>
                </dd>
              </div>

              {/* Email — heading removed per client request */}
             <div className="flex items-center gap-3">
  <dt className="sr-only">Email</dt>

  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-yellow-50 border border-yellow-200">
    <MailIcon className="h-4 w-4 text-yellow-600" />
  </span>

  <dd className="text-neutral-700 hover:text-yellow-500 transition break-all">
    <a href="mailto:info@ridgebackbuilt.com">
      info@ridgebackbuilt.com
    </a>
  </dd>
</div>


              {/* Location (kept as before) */}
              <div>
                <dt className="font-semibold text-neutral-900">Location</dt>
                <dd className="text-neutral-600">Florida</dd>
              </div>
               <div>
               
                <dd className="text-neutral-600">License # CGC1538364</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* subtle background glow (unchanged) */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />
    </section>
  );
}
