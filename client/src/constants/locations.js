// src/constants/locations.js

/**
 * Список міст для Autocomplete у формі та фільтрів у каталозі.
 * Відсортовано по популярності (топ — у каталозі).
 *
 * Якщо потрібно додати місто — додавайте сюди, воно одночасно з'явиться:
 *   • у фільтрах каталогу (PropertiesPage)
 *   • в Autocomplete створення/редагування property
 */
export const UKRAINIAN_CITIES = [
  "Kyiv",
  "Lviv",
  "Odesa",
  "Kharkiv",
  "Dnipro",
  "Chernivtsi",
  "Ivano-Frankivsk",
  "Ternopil",
  "Vinnytsia",
  "Zhytomyr",
  "Khmelnytskyi",
  "Lutsk",
  "Rivne",
  "Uzhhorod",
  "Mykolaiv",
  "Kherson",
  "Zaporizhzhia",
  "Poltava",
  "Cherkasy",
  "Sumy",
  "Chernihiv",
];

/**
 * Типи нерухомості — суворо відповідають enum у Property.js на бекенді:
 *   enum: ["apartment", "house", "commercial", "land"]
 *
 * НЕ додавайте сюди значення, яких немає в моделі — бекенд відхилить документ.
 * Якщо треба додати тип — спочатку оновіть enum у server/src/models/Property.js.
 */
export const PROPERTY_TYPES = [
  { value: "apartment",  label: "Apartment" },
  { value: "house",      label: "House" },
  { value: "commercial", label: "Commercial" },
  { value: "land",       label: "Land" },
];

/**
 * Статуси — теж відповідають enum моделі.
 * Owner може встановлювати "available" / "pending" / "sold".
 * "hidden" — внутрішній статус (приховування), окремо керується.
 */
export const PROPERTY_STATUSES = [
  { value: "available", label: "Available" },
  { value: "pending",   label: "Pending" },
  { value: "sold",      label: "Sold" },
];