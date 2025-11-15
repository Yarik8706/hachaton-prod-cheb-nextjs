import {Home, ShoppingCart, User} from "lucide-react";

export const layoutConfig = {
  headerHeight: "80px",
  footerHeight: "80px",
  maxMobileWidth: "768px",
  navItems: [
    { href: "/home/", icon: Home, label: "Главная" },
    // { href: "/search", icon: Search, label: "Поиск" },
    // { href: "/checkout", icon: CreditCard, label: "Оплата" },
    { href: "/home/profile/", icon: User, label: "Профиль" },
  ],
  categoryGradients: [
    "bg-gradient-to-br from-green-100 via-emerald-200 to-teal-300",
    "bg-gradient-to-tr from-teal-100 via-cyan-200 to-sky-300",
    "bg-gradient-to-br from-orange-100 via-amber-200 to-yellow-300",
    "bg-gradient-to-tl from-rose-100 via-pink-200 to-fuchsia-300"
  ]
} as const;

export const layoutHeight = `calc(100vh - ${layoutConfig.headerHeight} - ${layoutConfig.footerHeight})`;