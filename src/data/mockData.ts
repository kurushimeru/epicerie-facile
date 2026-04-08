export interface Store {
  id: string;
  name: string;
  distance?: number;
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: string;
  store: Store;
  category: string;
  isPromotion: boolean;
  originalPrice?: number;
}

export interface UserAccount {
  firstName: string;
  lastName: string;
  postalCode: string;
  storePreferences: string[];
  receiveNewsletter: boolean;
}

export interface ShoppingListItem {
  productId: string;
  quantity: number;
}

// Quebec grocery stores (Montreal-area coordinates)
export const stores: Store[] = [
  { id: "iga-plateau",   name: "IGA Plateau",    latitude: 45.5265, longitude: -73.5787 },
  { id: "metro-centre",  name: "Metro Centre-Ville", latitude: 45.5075, longitude: -73.5699 },
  { id: "maxi-cdn",      name: "Maxi CDN",        latitude: 45.4944, longitude: -73.6161 },
  { id: "superc-rosemont", name: "Super C Rosemont", latitude: 45.5402, longitude: -73.5831 },
  { id: "provigo-west",  name: "Provigo Westmount", latitude: 45.4817, longitude: -73.5985 },
];

export const categories = [
  "Produits laitiers",
  "Fruits et légumes",
  "Boulangerie",
  "Viandes et volailles",
  "Boissons",
  "Épicerie",
  "Collations",
  "Surgelés",
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Lait 3,25%",
    image: "https://images.unsplash.com/photo-1569696074196-402ff5882e23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 5.49,
    originalPrice: 6.99,
    quantity: "4L",
    store: stores[0],
    category: "Produits laitiers",
    isPromotion: true,
  },
  {
    id: "p2",
    name: "Pommes Gala",
    image: "https://images.unsplash.com/photo-1623815242959-fb20354f9b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 3.99,
    quantity: "1kg",
    store: stores[1],
    category: "Fruits et légumes",
    isPromotion: false,
  },
  {
    id: "p3",
    name: "Pain de ménage",
    image: "https://images.unsplash.com/photo-1666114170628-b34b0dcc21aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 3.49,
    originalPrice: 4.29,
    quantity: "675g",
    store: stores[2],
    category: "Boulangerie",
    isPromotion: true,
  },
  {
    id: "p4",
    name: "Cheddar fort",
    image: "https://images.unsplash.com/photo-1757857755327-5b38c51a0302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 7.99,
    quantity: "400g",
    store: stores[3],
    category: "Produits laitiers",
    isPromotion: false,
  },
  {
    id: "p5",
    name: "Poitrines de poulet",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 11.99,
    originalPrice: 15.99,
    quantity: "1kg",
    store: stores[0],
    category: "Viandes et volailles",
    isPromotion: true,
  },
  {
    id: "p6",
    name: "Jus d'orange",
    image: "https://images.unsplash.com/photo-1640213505284-21352ee0d76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 4.49,
    quantity: "1,89L",
    store: stores[1],
    category: "Boissons",
    isPromotion: false,
  },
  {
    id: "p7",
    name: "Spaghetti",
    image: "https://images.unsplash.com/photo-1751182471056-ecd29a41f339?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 1.79,
    originalPrice: 2.49,
    quantity: "500g",
    store: stores[4],
    category: "Épicerie",
    isPromotion: true,
  },
  {
    id: "p8",
    name: "Tomates raisins",
    image: "https://images.unsplash.com/photo-1700064165267-8fa68ef07167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 4.99,
    quantity: "454g",
    store: stores[2],
    category: "Fruits et légumes",
    isPromotion: false,
  },
  {
    id: "p9",
    name: "Yogourt grec nature",
    image: "https://images.unsplash.com/photo-1763825613390-287a9db0803d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 3.99,
    quantity: "750g",
    store: stores[3],
    category: "Produits laitiers",
    isPromotion: false,
  },
  {
    id: "p10",
    name: "Œufs blancs",
    image: "https://images.unsplash.com/photo-1759082495730-2a5090278e7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 5.49,
    originalPrice: 6.99,
    quantity: "12 œufs",
    store: stores[0],
    category: "Produits laitiers",
    isPromotion: true,
  },
  {
    id: "p11",
    name: "Bananes",
    image: "https://images.unsplash.com/photo-1711208224791-2cc390f53744?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 1.49,
    quantity: "1kg",
    store: stores[1],
    category: "Fruits et légumes",
    isPromotion: false,
  },
  {
    id: "p12",
    name: "Riz à grains longs",
    image: "https://images.unsplash.com/photo-1759771300108-5e04613b4a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    price: 6.99,
    originalPrice: 8.49,
    quantity: "2kg",
    store: stores[4],
    category: "Épicerie",
    isPromotion: true,
  },
];

export const allProducts: Product[] = [
  ...products,
  { ...products[0], id: "p13", store: stores[2], price: 5.99, isPromotion: false, originalPrice: undefined },
  { ...products[1], id: "p14", store: stores[3], price: 3.49, originalPrice: 4.49, isPromotion: true },
  { ...products[6], id: "p15", store: stores[1], price: 1.99, originalPrice: 2.79, isPromotion: true },
];
