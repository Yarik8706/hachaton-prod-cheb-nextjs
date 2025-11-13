import {ICartInput, ICategory, IOrder, IPartner, IProductCardData} from "@/store/types";

const mockProducts: IProductCardData[] = [
  {
    id: "1",
    title: "Молоко",
    image: "https://via.placeholder.com/150",
    cost: 100,
    partner: { id: "1", name: "Партнер 1" },
    time_delivery: "2025-10-18T09:03:46.570Z",
    category: { id: "1", name: "Категория 1" },
  },
  {
    id: "1",
    title: "Молоко",
    image: "https://via.placeholder.com/150",
    cost: 100,
    partner: { id: "1", name: "Партнер 1" },
    time_delivery: "2025-10-18T09:03:46.570Z",
    category: { id: "1", name: "Категория 1" },
  },
  {
    id: "1",
    title: "Молоко",
    image: "https://via.placeholder.com/150",
    cost: 100,
    partner: { id: "1", name: "Партнер 1" },
    time_delivery: "2025-10-18T09:03:46.570Z",
    category: { id: "1", name: "Категория 1" },
  },
  {
    id: "2",
    title: "Молоко",
    image: "https://via.placeholder.com/150",
    cost: 100,
    partner: { id: "1", name: "Партнер 1" },
    time_delivery: "2025-10-18T09:03:46.570Z",
    category: { id: "1", name: "Категория 1" },
  },
  {
    id: "2",
    title: "Молоко",
    image: "https://via.placeholder.com/150",
    cost: 100,
    partner: { id: "1", name: "Партнер 1" },
    time_delivery: "2025-10-18T09:03:46.570Z",
    category: { id: "1", name: "Категория 1" },
  },
  {
    id: "2",
    title: "Молоко",
    image: "https://via.placeholder.com/150",
    cost: 100,
    partner: { id: "1", name: "Партнер 1" },
    time_delivery: "2025-10-18T09:03:46.570Z",
    category: { id: "1", name: "Категория 1" },
  },
  {
    id: "3",
    title: "Молоко",
    image: "https://via.placeholder.com/150",
    cost: 100,
    partner: { id: "1", name: "Партнер 1" },
    time_delivery: "2025-10-18T09:03:46.570Z",
    category: { id: "1", name: "Категория 1" },
  },
];

export const partners: IPartner[] = [
  { id: "p-1", name: "Market Express" },
  { id: "p-2", name: "Fresh&Fast" },
  { id: "p-3", name: "Local Goods" },
];

export const categories: ICategory[] = [
  { id: "c-1", name: "Фрукты" },
  { id: "c-2", name: "Овощи" },
  { id: "c-3", name: "Молочные продукты" },
];

export const products: IProductCardData[] = [
  {
    id: "prod-1",
    title: "Яблоки Gala (1 кг)",
    image: "/images/products/apple_gala.jpg",
    cost: 199, // руб
    partner: partners[0],
    time_delivery: "2025-10-20T10:00:00.000Z",
    category: categories[0],
  },
  {
    id: "prod-2",
    title: "Бананы (1 кг)",
    image: "/images/products/bananas.jpg",
    cost: 149,
    partner: partners[1],
    time_delivery: "2025-10-20T12:00:00.000Z",
    category: categories[0],
  },
  {
    id: "prod-3",
    title: "Морковь (0.5 кг)",
    image: "/images/products/carrots.jpg",
    cost: 79,
    partner: partners[2],
    time_delivery: "2025-10-21T09:30:00.000Z",
    category: categories[1],
  },
  {
    id: "prod-4",
    title: "Молоко 2.5% (1 л)",
    image: "/images/products/milk_25.jpg",
    cost: 99,
    partner: partners[0],
    time_delivery: "2025-10-20T08:00:00.000Z",
    category: categories[2],
  },
  {
    id: "prod-5",
    title: "Творог 5% (200 г)",
    image: "/images/products/cottage_cheese.jpg",
    cost: 129,
    partner: partners[1],
    time_delivery: "2025-10-21T11:00:00.000Z",
    category: categories[2],
  },
];

// Пример профиля (IProfile)
export const profile = {
  id: "user-1",
  username: "ivan.petrov",
  address: "ул. Примерная, д. 10, кв. 5, г. Москва",
};

// Примеры корзин (ICartInput

// Примеры заказов (IOrder)
