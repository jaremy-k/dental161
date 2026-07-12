export type MapLink = {
  label: string;
  href: string;
};

export type Clinic = {
  id?: number;
  slug: string;
  title: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  legalEntityId: string;
  mapHref: string;
  mapLinks: MapLink[];
  sortOrder?: number;
  deletedAt?: string | null;
};

export type Doctor = {
  id?: number;
  slug: string;
  name: string;
  role: string;
  experience: string;
  focus: string[];
  location: string;
  locationIds: string[];
  image: string;
  sortOrder?: number;
  deletedAt?: string | null;
};

export type PriceItem = {
  name: string;
  price: string;
};

export type PriceCategory = {
  title: string;
  items: PriceItem[];
};

export type TreatmentPackage = {
  title: string;
  price: string;
  description: string;
};

export type PriceIntro = {
  title: string;
  lead: string;
  note: string;
};

export type PriceCatalog = {
  intro: PriceIntro;
  treatmentPackages: TreatmentPackage[];
  priceCategories: PriceCategory[];
  disclaimer: string;
};

export type PriceVersion = {
  id: number;
  versionNumber: number;
  label: string | null;
  data: PriceCatalog;
  isPublished: boolean;
  createdBy: string | null;
  createdAt: string;
  publishedAt: string | null;
};

export type ClinicInput = Omit<Clinic, "id" | "deletedAt">;
export type DoctorInput = Omit<Doctor, "id" | "deletedAt">;
