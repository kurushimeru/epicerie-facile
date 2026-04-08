import type { UserAccount, ShoppingListItem } from "@/data/mockData";

const KEYS = {
  USER_ACCOUNT:      "ef_userAccount",
  SHOPPING_LIST:     "ef_shoppingList",
  SEARCH_TAGS:       "ef_searchTags",
  POSTAL_CODE:       "ef_postalCode",
  RADIUS:            "ef_radius",
  LOCATION:          "ef_location",
  GEOLOCATION_ASKED: "ef_geolocationAsked",
} as const;

function get<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as T) : null;
}

function set(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUserAccount: () => get<UserAccount>(KEYS.USER_ACCOUNT),
  setUserAccount: (account: UserAccount) => set(KEYS.USER_ACCOUNT, account),

  getShoppingList: () => get<ShoppingListItem[]>(KEYS.SHOPPING_LIST) ?? [],
  setShoppingList: (list: ShoppingListItem[]) => set(KEYS.SHOPPING_LIST, list),

  getSearchTags: () => get<string[]>(KEYS.SEARCH_TAGS) ?? [],
  setSearchTags: (tags: string[]) => set(KEYS.SEARCH_TAGS, tags),

  getPostalCode: () => (typeof window !== "undefined" ? localStorage.getItem(KEYS.POSTAL_CODE) ?? "" : ""),
  setPostalCode: (code: string) => { if (typeof window !== "undefined") localStorage.setItem(KEYS.POSTAL_CODE, code); },

  getRadius: () => {
    if (typeof window === "undefined") return 10;
    const r = localStorage.getItem(KEYS.RADIUS);
    return r ? parseInt(r) : 10;
  },
  setRadius: (r: number) => { if (typeof window !== "undefined") localStorage.setItem(KEYS.RADIUS, String(r)); },

  getLocation: () => get<{ latitude: number; longitude: number }>(KEYS.LOCATION),
  setLocation: (loc: { latitude: number; longitude: number }) => set(KEYS.LOCATION, loc),

  getGeolocationAsked: () => (typeof window !== "undefined" ? localStorage.getItem(KEYS.GEOLOCATION_ASKED) === "true" : false),
  setGeolocationAsked: (asked: boolean) => { if (typeof window !== "undefined") localStorage.setItem(KEYS.GEOLOCATION_ASKED, String(asked)); },
};
