export type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  imageAlt: string;
  tag?: string;
  features: string[];
};

export type CatalogCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: "cotton-fabric",
    name: "Premium paxta mato",
    category: "Mato",
    description: "Yumshoq, nafas oladigan paxta — kundalik kiyim ishlab chiqarish uchun.",
    longDescription:
      "Yuqori sifatli 100% paxta matolarimiz kundalik kiyim, ichki kiyim va bolalar kolleksiyalari uchun ideal. Turli ranglar va og'irliklarda mavjud. Minimal buyurtma hajmi bo'yicha moslashtirilgan narxlar.",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Paxta mato rulonlari",
    tag: "Eng ko'p buyurtma",
    features: ["100% paxta", "Turli ranglar", "Ulgurji narx", "Namuna yuborish"],
  },
  {
    id: "linen-fabric",
    name: "Linen aralash mato",
    category: "Mato",
    description: "Yozgi kolleksiyalar uchun yengil va tabiiy linen matolar.",
    longDescription:
      "Tabiiy linen va paxta aralashmasi — yozgi ko'ylaklar, bluzkalar va yengil ustki kiyimlar uchun. Nafas oladigan tuzilish va premium ko'rinish.",
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Linen mato namunalari",
    tag: "Yangi kolleksiya",
    features: ["Linen aralash", "Yengil tuzilish", "Yozgi kolleksiya", "Ekologik"],
  },
  {
    id: "wool-sweater",
    name: "Yung sviter",
    category: "Triko",
    description: "Sovuq mavsum uchun issiq va yumshoq yung triko mahsulotlari.",
    longDescription:
      "Yuqori sifatli yungdan tayyorlangan sviterlar — erkaklar va ayollar kolleksiyalari. Turli ranglar, o'lchamlar va brendlashtirish imkoniyati.",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Yung sviter kolleksiyasi",
    tag: "Mavsumiy",
    features: ["Yuqori sifatli yung", "Turli o'lchamlar", "Brendlashtirish", "Ulgurji"],
  },
  {
    id: "knit-cardigan",
    name: "Triko kardigan",
    category: "Triko",
    description: "Zamonaviy kesimli kardiganlar — ulgurji va chakana uchun.",
    longDescription:
      "Zamonaviy va klassik modellardagi triko kardiganlar. Yumshoq ipak, paxta va akril aralashmalari. Katta hajmda buyurtmalar uchun maxsus narxlar.",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Triko kardigan",
    features: ["Zamonaviy kesim", "Yumshoq mato", "Katta hajm", "Tez yetkazish"],
  },
  {
    id: "denim-fabric",
    name: "Denim mato",
    category: "Denim",
    description: "Turli og'irlikdagi denim — jinsa va kurtkalar uchun.",
    longDescription:
      "8–14 oz og'irlikdagi premium denim matolar. Jinsa shimlar, kurtkalar va jiletalar uchun. Barqaror rang va yuqori chidamlilik.",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Denim mato",
    tag: "Eng ko'p buyurtma",
    features: ["8–14 oz", "Barqaror rang", "Yuqori chidamlilik", "Ulgurji rulon"],
  },
  {
    id: "denim-jacket",
    name: "Denim kurtka",
    category: "Denim",
    description: "Klassik va zamonaviy denim kurtkalar — barqaror sifat.",
    longDescription:
      "Erkaklar va ayollar uchun denim kurtkalar. Klassik trucker va zamonaviy oversize modellar. Brending va yorliq qo'yish xizmati mavjud.",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Denim kurtka",
    features: ["Klassik modellar", "Zamonaviy kesim", "Brending", "Sifat kafolati"],
  },
  {
    id: "basic-tee",
    name: "Basic t-shirt",
    category: "Asosiy kiyimlar",
    description: "100% paxta basic futbolkalar — katta hajmda buyurtmalar uchun.",
    longDescription:
      "Kundalik basic futbolkalar — 100% tarang paxta, turli ranglar va o'lchamlar. Korporativ brending va bosma xizmati ham mavjud.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Basic t-shirt",
    tag: "Yangi kolleksiya",
    features: ["100% paxta", "20+ rang", "Bosma xizmat", "Minimal buyurtma"],
  },
  {
    id: "cotton-shirt",
    name: "Paxta ko'ylak",
    category: "Asosiy kiyimlar",
    description: "Klassik va slim fit ko'ylaklar — ofis va kundalik uchun.",
    longDescription:
      "Ofis va kundalik kiyim uchun klassik va slim fit ko'ylaklar. Yuqori sifatli paxta, nozik tikuv va turli ranglar. Ulgurji va korporativ buyurtmalar.",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Paxta ko'ylak",
    features: ["Slim & klassik fit", "Ofis uchun", "Korporativ", "Ulgurji narx"],
  },
];

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: "mato",
    name: "Mato",
    description: "Paxta, linen va aralash matolar — ishlab chiqaruvchilar uchun.",
    image:
      "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Mato kolleksiyasi",
  },
  {
    id: "triko",
    name: "Triko",
    description: "Sviter, kardigan va triko aksessuarlar — ulgurji narxlar.",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Triko kolleksiyasi",
  },
  {
    id: "denim",
    name: "Denim",
    description: "Denim mato va tayyor kiyimlar — barqaror yetkazib berish.",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Denim kolleksiyasi",
  },
  {
    id: "basics",
    name: "Asosiy kiyimlar",
    description: "T-shirt, ko'ylak va ichki kiyimlar — katta hajmli buyurtmalar.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Asosiy kiyimlar",
  },
];

export const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=700&q=80",
    alt: "Premium mato",
    className: "top-0 left-0 h-[52%] w-[55%] -rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80",
    alt: "Triko kolleksiya",
    className: "top-6 right-0 h-[48%] w-[50%] rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",
    alt: "Denim mato",
    className: "bottom-0 left-[18%] h-[50%] w-[48%] rotate-1",
  },
  {
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
    alt: "Basic kiyimlar",
    className: "bottom-4 right-[4%] h-[46%] w-[45%] -rotate-1",
  },
];

export const PRODUCT_FILTERS = [
  "Hammasi",
  "Mato",
  "Triko",
  "Denim",
  "Asosiy kiyimlar",
] as const;

export type ProductFilter = (typeof PRODUCT_FILTERS)[number];

export const STATS = [
  { value: "10+", label: "Yillik tajriba" },
  { value: "500+", label: "B2B hamkorlar" },
  { value: "4", label: "Mahsulot yo'nalishi" },
  { value: "24/7", label: "Menejer yordami" },
];

export function getProductById(id: string): CatalogProduct | undefined {
  return CATALOG_PRODUCTS.find((product) => product.id === id);
}

export function getRelatedProducts(
  product: CatalogProduct,
  limit = 3,
): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter(
    (item) => item.category === product.category && item.id !== product.id,
  ).slice(0, limit);
}
