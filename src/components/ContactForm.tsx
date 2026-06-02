"use client";

import { FormEvent, useMemo, useState } from "react";
import { dentalServices } from "@/lib/services";
import { site } from "@/lib/site";

type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const serviceOptions = useMemo(
    () => dentalServices.map((service) => service.shortTitle),
    [],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Callback request failed");
      }

      setState("success");
      setMessage("Заявка отправлена. Администратор свяжется с вами в ближайшее время.");
      form.reset();
    } catch {
      setState("error");
      setMessage(
        "Не удалось отправить заявку. Позвоните нам или напишите в WhatsApp — мы быстро поможем.",
      );
    }
  }

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Получить план лечения
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Оставьте контакты — администратор уточнит задачу и подберёт удобное
            время в одной из клиник.
          </p>
        </div>
        <span className="hidden rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent-dark sm:inline-flex">
          Ответим до 15 минут
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Ваше имя</span>
          <input
            name="name"
            type="text"
            required
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none ring-accent/0 transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Как к вам обращаться?"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Телефон</span>
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="+7 (___) ___-__-__"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Что беспокоит
          </span>
          <select
            name="service"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            defaultValue=""
          >
            <option value="">Выберите услугу</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
            <option value="Острая боль">Острая боль</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Клиника</span>
          <select
            name="clinic"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            defaultValue=""
          >
            <option value="">Любая удобная</option>
            {site.locations.map((location) => (
              <option key={location.address} value={location.title}>
                {location.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Удобное время
          </span>
          <input
            name="preferredTime"
            type="text"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Например: сегодня после 17:00"
          />
        </label>
        <label className="flex items-start gap-3 sm:col-span-2">
          <input
            name="consent"
            type="checkbox"
            required
            value="yes"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
          />
          <span className="text-xs leading-relaxed text-slate-500">
            Даю согласие на обработку персональных данных и обратную связь по
            указанному номеру.{" "}
            <a href="/privacy" className="text-accent hover:text-accent-dark">
              Политика конфиденциальности
            </a>
            .
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-6 w-full rounded-full bg-accent py-3.5 font-semibold text-white transition hover:bg-accent-dark disabled:cursor-wait disabled:opacity-70"
      >
        {state === "loading" ? "Отправляем..." : "Отправить заявку"}
      </button>

      {message && (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            state === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <a className="font-semibold text-accent hover:text-accent-dark" href={`tel:${site.phone}`}>
          Позвонить
        </a>
        {site.messengers.map((messenger) => (
          <a
            key={messenger.label}
            className="font-semibold text-accent hover:text-accent-dark"
            href={messenger.href}
          >
            {messenger.label}
          </a>
        ))}
      </div>
    </form>
  );
}
