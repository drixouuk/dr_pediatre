"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type Props = {
  locale: string;
};

export default function ContactForm({ locale }: Props) {
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm">
        <p className="text-base font-medium text-stone-700">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-stone-700"
        >
          {t("name_label")}
        </label>
        <input
          id="name"
          type="text"
          required
          placeholder={t("name_placeholder")}
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="mb-1 block text-sm font-medium text-stone-700"
        >
          {t("phone_label")}
        </label>
        <input
          id="phone"
          type="tel"
          required
          placeholder={t("phone_placeholder")}
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-stone-700"
        >
          {t("message_label")}
        </label>
        <textarea
          id="message"
          rows={4}
          required
          placeholder={t("message_placeholder")}
          className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-colors duration-200"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary-700 py-2.5 text-base text-white hover:bg-primary-800"
      >
        {t("send")}
      </Button>
    </form>
  );
}
