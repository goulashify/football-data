import {expect, test} from '@playwright/test';
import {competitions_response, teams_first_page, teams_second_page} from './har/responses';

test('competitions – in-season visible', async ({page}) => {
    // Given two currently playing competitions.
    competitions_response.competitions.forEach(c => c.currentSeason.endDate = "2020-01-02");
    competitions_response.competitions[0].currentSeason.endDate = "2040-01-01";
    competitions_response.competitions[1].currentSeason.endDate = "2040-01-01";
    await page.route("**/v4/competitions", async req => req.fulfill({json: competitions_response}));

    // When visiting the home page.
    await page.goto('http://localhost:4173/');

    // Only in-season competitions are visible.
    await expect(page.locator('a > span', {hasText: competitions_response.competitions[0].name})).toBeVisible();
    await expect(page.locator('a > span', {hasText: competitions_response.competitions[1].name})).toBeVisible();

    // And other (out of season) competitions are not shown.
    await expect(page.locator('a > span', {hasText: competitions_response.competitions[2].name})).toHaveCount(0);
});

test('competitions – out of season not shown', async ({page}) => {
    // Given two pages of teams.
    await page.route("**/v4/competitions", async req => req.fulfill({json: competitions_response}));
    await page.route("**/v4/teams?limit=30&offset=0", async req => req.fulfill({json: teams_first_page}));

    // When visiting the home page,and scrolling Teams into view.
    await page.goto('http://localhost:4173/');
    await page.getByRole('heading', {name: 'Teams'}).scrollIntoViewIfNeeded();

    // The first batch of teams are loaded.
    await expect(page.getByRole('link', {name: teams_first_page.teams[0].name})).toBeVisible();
    await expect(page.getByRole('link', {name: teams_first_page.teams[teams_first_page.teams.length - 1].name})).toBeVisible();
});

test('teams – loads first page when spinner enters viewport', async ({page}) => {
    // Given two pages of teams, with the first page loaded.
    await page.route("**/v4/competitions", async req => req.fulfill({json: competitions_response}));
    await page.route("**/v4/teams?limit=30&offset=0", async req => req.fulfill({json: teams_first_page}));
    await page.route("**/v4/teams?limit=30&offset=30", async req => req.fulfill({json: teams_second_page}));
    await page.goto('http://localhost:4173/');
    await page.getByRole('heading', {name: 'Teams'}).scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', {name: teams_first_page.teams[0].name})).toBeVisible();
    await expect(page.getByRole('link', {name: teams_first_page.teams[teams_first_page.teams.length - 1].name})).toBeVisible();

    // When scrolling down to the "spinner".
    await page.locator('.relative > .mx-auto').scrollIntoViewIfNeeded();

    // The second page of results are loaded.
    await expect(page.getByRole('link', {name: teams_second_page.teams[0].name})).toBeVisible();
    await expect(page.getByRole('link', {name: teams_second_page.teams[teams_second_page.teams.length - 1].name})).toBeVisible();
});

test('teams – spinner disappears after last page loaded', async ({page}) => {
    // Given one page of teams, loaded.
    const teamsResponse = structuredClone(teams_second_page);
    teamsResponse.teams = []
    await page.route("**/v4/competitions", async req => req.fulfill({json: competitions_response}));
    await page.route("**/v4/teams?limit=30&offset=0", async req => req.fulfill({json: teams_first_page}));
    await page.route("**/v4/teams?limit=30&offset=30", async req => req.fulfill({json: teamsResponse}));
    await page.goto('http://localhost:4173/');
    await page.getByRole('heading', {name: 'Teams'}).scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', {name: teams_first_page.teams[0].name})).toBeVisible();
    await expect(page.getByRole('link', {name: teams_first_page.teams[teams_first_page.teams.length - 1].name})).toBeVisible();

    // When scrolling down to the "spinner".
    await page.locator('.relative > .mx-auto').scrollIntoViewIfNeeded();

    // The spinner disappears, as there are no more pages to load.
    await expect(page.locator('.relative > .mx-auto')).toHaveCount(0);
});
