export const site = {
  name: "ДенталКеа",
  brand: "DentalCare",
  url: "https://dentalcare161.ru",
  tagline: "Сеть стоматологических клиник в Ростове-на-Дону",
  phone: "+79959186061",
  phoneDisplay: "+7 (995) 918-60-61",
  whatsapp: "https://wa.me/79959186061",
  schedule: "Пн–Сб, 9:00–20:00",
  city: "Ростов-на-Дону",
  reviewLinks: [
    {
      label: "Яндекс Карты",
      href: "https://yandex.ru/maps/?text=DentalCare%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83",
    },
    {
      label: "2ГИС",
      href: "https://2gis.ru/rostov/search/DentalCare",
    },
  ],
  trust: [
    "План лечения и смета до начала процедур",
    "Рассрочка 0% до 12 месяцев",
    "Экстренные окна при острой боли",
    "Гарантия на выполненные работы",
  ],
  legal: {
    company: 'ООО «МЕДЛАЙФ»',
    ogrn: "1176196014037",
    inn: "6161081080",
  },
  locations: [
    {
      title: "Клиника на Орбитальной",
      address: "г. Ростов-на-Дону, ул. Орбитальная, 15",
      mapHref:
        "https://yandex.ru/maps/?text=%D0%B3.%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83%2C%20%D1%83%D0%BB.%20%D0%9E%D1%80%D0%B1%D0%B8%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%2C%2015",
    },
    {
      title: "Клиника на Кулагина",
      address: "г. Ростов-на-Дону, ул. Кулагина, 21",
      mapHref:
        "https://yandex.ru/maps/?text=%D0%B3.%20%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83%2C%20%D1%83%D0%BB.%20%D0%9A%D1%83%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0%2C%2021",
    },
  ],
} as const;

export const nav = [
  { href: "/o-nas", label: "О нас" },
  { href: "/services", label: "Услуги" },
  { href: "/#doctors", label: "Врачи" },
  { href: "/price", label: "Цены" },
  { href: "/#contacts", label: "Контакты" },
] as const;
