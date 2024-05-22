import {computed, readonly, ref, watch} from "vue";
import {ShortTeam} from "@/service/backend.ts";
import {StoreKeys} from "@/constant.ts";

// Save favorites to local storage. This will break at ~ 5-10mb stored.
const favoriteTeams = ref(StoreKeys.FAVORITE_TEAMS.get() || []);
const favoriteTeamsMap = computed(() => favoriteTeams.value.reduce((acc, team) => ({...acc, [team.id]: team}), {}));
watch(favoriteTeams, (curr) => StoreKeys.FAVORITE_TEAMS.set(curr), {deep: true})

function toggleFavorite(team: ShortTeam) {
    console.log('toggling', favoriteTeams.value);
    if (team.id in favoriteTeamsMap.value) return removeFavorite(team.id);
    return addFavorite(team);
}

function addFavorite(team: ShortTeam) {
    if (team.id in favoriteTeamsMap.value) return;
    favoriteTeams.value.push(team);
}

function removeFavorite(id: number) {
    console.log('removing')
    favoriteTeams.value = favoriteTeams.value.filter(team => team.id !== id);
}

export default function useUser() {
    return {
        favoriteTeams: readonly(favoriteTeams),
        favoriteTeamsMap,
        toggleFavorite
    }
}

