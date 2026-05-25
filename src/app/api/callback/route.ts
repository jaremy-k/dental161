import { NextResponse } from "next/server";

type CallbackPayload = {
  name?: string;
  phone?: string;
  service?: string;
  clinic?: string;
  preferredTime?: string;
  consent?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 500) : "";
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

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const text = [
      "Новая заявка с сайта DentalCare",
      `Имя: ${lead.name}`,
      `Телефон: ${lead.phone}`,
      `Услуга: ${lead.service}`,
      `Клиника: ${lead.clinic}`,
      `Время: ${lead.preferredTime}`,
    ].join("\n");

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: "Не удалось отправить заявку." },
        { status: 502 },
      );
    }
  } else {
    console.info("DentalCare callback lead", lead);
  }

  return NextResponse.json({ ok: true });
}
