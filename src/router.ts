import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";

export const Paths = {
    HOME: {
        path: '/',
        name: 'home',
        component: () => import('@/components/page/HomePage.vue'),
    },
    LEAGUE: {
        path: '/leagues/:code',
        name: 'league',
        props: true,
        component: () => import('@/components/page/LeaguePage.vue'),
    },
    TEAM: {
        path: '/teams/:id',
        name: 'team',
        props: true,
        component: () => import('@/components/page/TeamPage.vue'),
    },
    FAVORITE_TEAMS: {
        path: '/user/favorite-teams',
        name: 'favorite-teams',
        props: true,
        component: () => import('@/components/page/user/FavoriteTeamsPage.vue'),
    }
} satisfies { [k: string]: RouteRecordRaw }

const router = createRouter({
    history: createWebHistory('/'),
    routes: Object.values(Paths),
});

export default router;
