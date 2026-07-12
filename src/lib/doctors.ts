export type Doctor = {
  slug: string;
  name: string;
  role: string;
  experience: string;
  focus: string[];
  location: string;
  locationIds: string[];
  image: string;
};

export const doctors: Doctor[] = [
  {
    slug: "koccharov",
    name: "Кочаров Сергей Эдуардович",
    role: "Главный врач, стоматолог-ортопед",
    experience: "Стаж более 15 лет",
    focus: ["Протезирование", "Коронки", "Сложные планы лечения"],
    location: "Орбитальная / Кулагина",
    locationIds: ["orbitalnaya", "kulagina"],
    image: "/images/doctors/koccharov.jpg",
  },
  {
    slug: "tonyan",
    name: "Тонян Артем Валерьевич",
    role: "Стоматолог-хирург, имплантолог",
    experience: "Стаж более 10 лет",
    focus: ["Имплантация", "Удаление зубов", "ALL ON 4 / ALL ON 6"],
    location: "Орбитальная / Кулагина",
    locationIds: ["orbitalnaya", "kulagina"],
    image: "/images/doctors/tonyan.jpg",
  },
  {
    slug: "nasimov",
    name: "Насимов Эльмар Илимдарович",
    role: "Стоматолог, стоматолог-ортопед",
    experience: "Ортопедический приём",
    focus: ["Протезирование", "Коронки", "Восстановление зубов"],
    location: "Орбитальная",
    locationIds: ["orbitalnaya"],
    image: "/images/doctors/nasimov.jpg",
  },
  {
    slug: "spanderashvili",
    name: "Спандерашвили Паата Шотаевич",
    role: "Стоматолог-хирург, хирург-имплантолог",
    experience: "Стаж работы 37 лет",
    focus: [
      "Имплантация",
      "Удаление",
      "Восстановление целостности зубного ряда",
    ],
    location: "Красноармейская",
    locationIds: ["krasnoarmeyskaya"],
    image: "/images/doctors/spanderashvili.jpg",
  },
  {
    slug: "ivanova",
    name: "Иванова Дарья Евгеньевна",
    role: "Стоматолог-ортодонт",
    experience: "Ортодонтический приём",
    focus: ["Прикус", "Брекеты", "Элайнеры"],
    location: "Орбитальная / Кулагина",
    locationIds: ["orbitalnaya", "kulagina"],
    image: "/images/doctors/ivanova.jpg",
  },
  {
    slug: "tatarinova",
    name: "Татаринова Светлана Сергеевна",
    role: "Ассистент стоматолога",
    experience: "Ассистирование врачам",
    focus: ["Комфорт приёма", "Подготовка кабинета", "Сопровождение"],
    location: "Орбитальная / Кулагина",
    locationIds: ["orbitalnaya", "kulagina"],
    image: "/images/doctors/tatarinova.jpg",
  },
];

export function getDoctorsByLocationSlug(slug: string) {
  return doctors.filter((doctor) => doctor.locationIds.includes(slug));
}
