import {API} from "@/constant.ts";


// Private API.

async function get(path: string) {
    let headers = {'X-Auth-Token': API.KEY}
    let uri = `${API.BASE_URL}${path}`;
    let resp = await fetch(uri, {headers: headers});
    if (resp.status.toString()[0] !== '2') {
        console.warn('Non-2xx response: %o.', resp);
        throw new Error(`Non-2xx response from "${uri}".`);
    }
    return await resp.json();
}


// Public API.

async function listCompetitions() {
    let resp: ListCompetitionsResponse = await get('/v4/competitions');
    return resp.competitions;
}

async function listStandings(leagueCode: string): Promise<ListStandingsResponse> {
    return await get(`/v4/competitions/${leagueCode}/standings`);
}

async function listTeams(pageToken = 0, limit = 25) {
    let resp: ListTeamsResponse = await get(`/v4/teams?limit=${limit}&offset=${pageToken}`);
    let nextPageToken = resp.teams.length > 0 ? pageToken + limit : undefined;
    return {results: resp.teams, nextPageToken};
}

async function getTeam(id: number): Promise<GetTeamResponse> {
    return await get(`/v4/teams/${id}`);
}

export default function useBackend() {
    return {
        listCompetitions,
        listStandings,
        listTeams,
        getTeam
    }
}


// Messages.

type ListCompetitionsResponse = {
    "count": number,
    "filters": {
        "client": string
    },
    "competitions": Competition[]
}

type ListTeamsResponse = {
    "count": number,
    "filters": {
        "limit": number,
        "offset": number,
        // Ex: "TIER_ONE"
        "permission": string
    },
    "teams": Team[]
}

export type ListStandingsResponse = {
    "filters": {
        // Ex: "2022"
        "season": string
    },
    "area": Area,
    "competition": ShortCompetition,
    "season": Season,
    "standings": Group[]
}

export type GetTeamResponse = Team & {
    "area": Area,
    "runningCompetitions": ShortCompetition[],
    "coach": {
        "id": number,
        "firstName": string,
        // Ex: "Xabi Alonso"
        "lastName": string,
        // Ex: "Xabi Alonso"
        "name": string,
        // Ex: "1981-11-25"
        "dateOfBirth": string,
        // Ex: "Spain"
        "nationality": string,

        "contract": {
            // Ex: "2022-10"
            "start": string,
            // Ex: "2026-06"
            "until": string
        }
    },
    "squad": Player[],
    "staff": [],
}

// Resources.

export type Player = {
    "id": number,
    // Ex: "Francis Onyeka"
    "name": string,
    // Ex: "Offence"
    "position": string,
    // Ex: "2007-04-29"
    "dateOfBirth": string,
    // Ex: "Germany"
    "nationality": string
}

export type Group = {
    "stage": 'FINAL' | 'THIRD_PLACE' | 'SEMI_FINALS' | 'QUARTER_FINALS' | 'LAST_16' | 'LAST_32' | 'LAST_64' | 'ROUND_4' | 'ROUND_3' | 'ROUND_2' | 'ROUND_1' | 'GROUP_STAGE' | 'PRELIMINARY_ROUND' | 'QUALIFICATION' | 'QUALIFICATION_ROUND_1' | 'QUALIFICATION_ROUND_2' | 'QUALIFICATION_ROUND_3' | 'PLAYOFF_ROUND_1' | 'PLAYOFF_ROUND_2' | 'PLAYOFFS' | 'REGULAR_SEASON' | 'CLAUSURA' | 'APERTURA' | 'CHAMPIONSHIP' | 'RELEGATION' | 'RELEGATION_ROUND',
    // Not 100% sure. See https://docs.football-data.org/general/v4/competition.html#_standings.
    "type": "TOTAL" | "HOME" | "AWAY",
    // Ex: "Group A"
    "group": string,
    "table": Standing[]
}

export type Standing = {
    // Ex: 1
    "position": number,
    "team": ShortTeam,
    "playedGames": number,
    "form": null,
    "won": number,
    "draw": number,
    "lost": number,
    "points": number,
    "goalsFor": number,
    "goalsAgainst": number,
    "goalDifference": number
}

export type ShortTeam = {
    "id": number,
    // Ex: "Bayer 04 Leverkusen"
    "name": string,
    // Ex: "Leverkusen"
    "shortName": string,
    // Ex: "B04"
    "tla": string,
    // Ex: "https://crests.football-data.org/3.png"
    "crest": string,
}

export type Team = ShortTeam & {
    // Ex: "Bismarckstr. 122-124 Leverkusen 51373"
    "address": string,
    // Ex: "http://www.bayer04.de"
    "website": string,
    // Ex: 1904
    "founded": number,
    // Ex: "Red / White / Black"
    "clubColors": string,
    // Ex: "BayArena"
    "venue": string,
    // Ex: "2022-02-25T16:43:07Z"
    "lastUpdated": string
}

export type ShortCompetition = {
    "id": number,
    // Ex: "Campeonato Brasileiro Série A"
    "name": string,
    // Ex: "BSA"
    "code": string,
    "type": "LEAGUE" | "LEAGUE_CUP" | "CUP" | "PLAYOFFS",
    // Ex: "https://crests.football-data.org/bsa.png"
    "emblem": string,
}

export type Competition = ShortCompetition & {
    "area": Area,
    // Ex: "TIER_ONE"
    "plan": string,
    "currentSeason": Season,
    "numberOfAvailableSeasons": number,
    // Ex: "2024-05-08T14:08:14Z"
    "lastUpdated": string
}

export type Season = {
    "id": number,
    // Ex: "2024-04-13"
    "startDate": string,
    // Ex: "2024-12-08"
    "endDate": string,
    "currentMatchday": number,
    "winner": null | Team
}

export type Area = {
    "id": number,
    // Ex: "Brazil"
    "name": string,
    // Ex: "BRA"
    "code": string,
    // Ex: "https://crests.football-data.org/764.svg"
    "flag": string
}
