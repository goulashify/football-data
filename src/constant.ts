import {newJsonKey} from "@/util.ts";
import {ShortTeam} from "@/service/backend.ts";

export const API = {
    BASE_URL: import.meta.env.VITE_APP_API_BASE_URL,
    KEY: import.meta.env.VITE_APP_API_KEY,
}

export const StoreKeys = {
    FAVORITE_TEAMS: newJsonKey<ShortTeam[]>('x-football/favorite-teams')
}
