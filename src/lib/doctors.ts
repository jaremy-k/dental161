export type Doctor = {
  slug: string;
  name: string;
  role: string;
  image: string;
};

export const doctors: Doctor[] = [
  {
    slug: "koccharov",
    name: "Кочаров Сергей Эдуардович",
    role: "Главный врач, стоматолог-ортопед",
    image: "/images/doctors/koccharov.jpg",
  },
  {
    slug: "tonyan",
    name: "Тонян Артем Валерьевич",
    role: "Стоматолог-хирург, имплантолог",
    image: "/images/doctors/tonyan.jpg",
  },
  {
    slug: "tikhomirova",
    name: "Тихомирова Ольга Владимировна",
    role: "Стоматолог-терапевт",
    image: "/images/doctors/tikhomirova.jpg",
  },
  {
    slug: "ivanova",
    name: "Иванова Дарья Евгеньевна",
    role: "Стоматолог-ортодонт",
    image: "/images/doctors/ivanova.jpg",
  },
  {
    slug: "cherkashina",
    name: "Черкашина Лилия Владимировна",
    role: "Стоматолог",
    image: "/images/doctors/cherkashina.jpg",
  },
  {
    slug: "bogush",
    name: "Богуш Юлия Павловна",
    role: "Стоматолог-терапевт",
    image: "/images/doctors/bogush.jpg",
  },
  {
    slug: "tatarinova",
    name: "Татаринова Светлана Сергеевна",
    role: "Ассистент стоматолога",
    image: "/images/doctors/tatarinova.jpg",
  },
];
