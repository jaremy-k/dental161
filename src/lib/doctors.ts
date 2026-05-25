export type Doctor = {
  slug: string;
  name: string;
  role: string;
  experience: string;
  focus: string[];
  location: string;
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
    image: "/images/doctors/koccharov.jpg",
  },
  {
    slug: "tonyan",
    name: "Тонян Артем Валерьевич",
    role: "Стоматолог-хирург, имплантолог",
    experience: "Стаж более 10 лет",
    focus: ["Имплантация", "Удаление зубов", "ALL ON 4 / ALL ON 6"],
    location: "Орбитальная / Кулагина",
    image: "/images/doctors/tonyan.jpg",
  },
  {
    slug: "tikhomirova",
    name: "Тихомирова Ольга Владимировна",
    role: "Стоматолог-терапевт",
    experience: "Терапевтический приём",
    focus: ["Кариес", "Пульпит", "Реставрации"],
    location: "Орбитальная",
    image: "/images/doctors/tikhomirova.jpg",
  },
  {
    slug: "ivanova",
    name: "Иванова Дарья Евгеньевна",
    role: "Стоматолог-ортодонт",
    experience: "Ортодонтический приём",
    focus: ["Прикус", "Брекеты", "Элайнеры"],
    location: "Кулагина",
    image: "/images/doctors/ivanova.jpg",
  },
  {
    slug: "cherkashina",
    name: "Черкашина Лилия Владимировна",
    role: "Стоматолог",
    experience: "Семейный приём",
    focus: ["Профилактика", "Лечение зубов", "Гигиена"],
    location: "Орбитальная",
    image: "/images/doctors/cherkashina.jpg",
  },
  {
    slug: "bogush",
    name: "Богуш Юлия Павловна",
    role: "Стоматолог-терапевт",
    experience: "Терапевтический приём",
    focus: ["Кариес", "Эстетика", "Профилактика"],
    location: "Кулагина",
    image: "/images/doctors/bogush.jpg",
  },
  {
    slug: "tatarinova",
    name: "Татаринова Светлана Сергеевна",
    role: "Ассистент стоматолога",
    experience: "Ассистирование врачам",
    focus: ["Комфорт приёма", "Подготовка кабинета", "Сопровождение"],
    location: "Орбитальная / Кулагина",
    image: "/images/doctors/tatarinova.jpg",
  },
];
