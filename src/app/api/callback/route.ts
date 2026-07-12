import { NextResponse } from "next/server";
import { saveLead } from "@/lib/leads";

type CallbackPayload = {
  name?: string;
  phone?: string;
  service?: string;
  clinic?: string;
  preferredTime?: string;
  consent?: string;
};

type Lead = {
  name: string;
  phone: string;
  service: string;
  clinic: string;
  preferredTime: string;
  createdAt: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
}

function formatLeadMessage(lead: Lead) {
  return [
    "Новая заявка с сайта DentalCare",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Услуга: ${lead.service}`,
    `Клиника: ${lead.clinic}`,
    `Время: ${lead.preferredTime}`,
  ].join("\n");
}

async function sendMaxMessage(lead: Lead) {
  const token = process.env.MAX_BOT_TOKEN;
  const chatId = process.env.MAX_CHAT_ID;

  if (!token || !chatId) {
    return false;
  }

  const apiBase = process.env.MAX_API_BASE || "https://platform-api.max.ru";
  const url = new URL("/messages", apiBase);
  url.searchParams.set("chat_id", chatId);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: formatLeadMessage(lead),
      notify: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`MAX request failed with ${response.status}`);
  }

  return true;
}

async function sendTelegramMessage(lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return false;
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: formatLeadMessage(lead) }),
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram request failed with ${response.status}`);
  }

  return true;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CallbackPayload;
  const name = clean(body.name);
  const phone = clean(body.phone);
  const service = clean(body.service);
  const clinic = clean(body.clinic);
  const preferredTime = clean(body.preferredTime);
  const consent = clean(body.consent);

  if (!name || !phone || consent !== "yes") {
    return NextResponse.json(
      { ok: false, error: "Заполните имя, телефон и согласие." },
      { status: 400 },
    );
  }

  const lead = {
    name,
    phone,
    service: service || "Не указано",
    clinic: clinic || "Любая удобная",
    preferredTime: preferredTime || "Не указано",
    createdAt: new Date().toISOString(),
  };

  try {
    await saveLead({
      name: lead.name,
      phone: lead.phone,
      service: lead.service,
      clinic: lead.clinic,
      preferredTime: lead.preferredTime,
    });
  } catch (error) {
    console.error("DentalCare lead save failed", error);
  }

  try {
    const sentToMax = await sendMaxMessage(lead);
    const sentToTelegram = sentToMax ? false : await sendTelegramMessage(lead);

    if (!sentToMax && !sentToTelegram) {
      console.info("DentalCare callback lead", lead);
    }
  } catch (error) {
    console.error("DentalCare callback delivery failed", error);

      return NextResponse.json(
        { ok: false, error: "Не удалось отправить заявку." },
        { status: 502 },
      );
  }

  return NextResponse.json({ ok: true });
}
