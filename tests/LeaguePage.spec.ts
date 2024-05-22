import {expect, test} from '@playwright/test';
import {standings_response} from './har/responses';


test('displays teams', async ({page}) => {
    // Given a competiton.
    await page.route("**/v4/competitions/CL/standings", async req => req.fulfill({json: standings_response}));

    // When visiting the competition page.
    await page.goto('http://localhost:4173/leagues/CL');

    // The competition details are presented.
    await expect(page.getByRole('heading', {name: standings_response.competition.name})).toBeVisible();

    // The groups of teams are displayed.
    await expect(page.locator('td a > div', {hasText: "FC Bayern München"})).toBeVisible();
    await expect(page.locator('td a > div', {hasText: "FC København"})).toBeVisible();
    await expect(page.locator('td a > div', {hasText: "Galatasaray SK"})).toBeVisible();
    await expect(page.locator('td a > div', {hasText: "Manchester United FC"})).toBeVisible();
});

test('can sort teams by name', async ({page}) => {
    // Given a competiton.
    await page.route("**/v4/competitions/CL/standings", async req => req.fulfill({json: standings_response}));

    // When visiting the competition page.
    await page.goto('http://localhost:4173/leagues/CL');

    // And sorting by team name.
    await page.locator('th > a', {hasText: 'Team'}).click();

    // Teams are sorted in ascending order.
    const teams = page.locator('tr:has(td) > td > div > a > div:nth-child(1)');
    await expect(teams.nth(0)).toHaveText('FC Bayern München');
    await expect(teams.nth(1)).toHaveText('FC København');
    await expect(teams.nth(2)).toHaveText('Galatasaray SK');
    await expect(teams.nth(3)).toHaveText('Manchester United FC');

    // When clicking on the sorting button again.
    await page.locator('th > a', {hasText: 'Team'}).click();

    // Teams are sorted in descending order.
    await expect(teams.nth(0)).toHaveText('Manchester United FC');
    await expect(teams.nth(1)).toHaveText('Galatasaray SK');
    await expect(teams.nth(2)).toHaveText('FC København');
    await expect(teams.nth(3)).toHaveText('FC Bayern München');

    // When clicking on the sorting button again.
    await page.locator('th > a', {hasText: 'Team'}).click();

    // Teams appear in their natural order.
    await expect(teams.nth(0)).toHaveText(standings_response.standings[0].table[0].team.name);
    await expect(teams.nth(1)).toHaveText(standings_response.standings[0].table[1].team.name);
    await expect(teams.nth(2)).toHaveText(standings_response.standings[0].table[2].team.name);
    await expect(teams.nth(3)).toHaveText(standings_response.standings[0].table[3].team.name);
});

test('favorites persist across reloads', async ({page}) => {
    // Given a competiton.
    await page.route("**/v4/competitions/CL/standings", async req => req.fulfill({json: standings_response}));

    // When visiting the competition page.
    await page.goto('http://localhost:4173/leagues/CL');

    // And saving a team to favorites.
    const favoriteBtn = page.locator('tr > td > button').nth(0);
    await favoriteBtn.click();

    // Then the heart is filled.
    await expect(favoriteBtn.locator('svg')).toHaveClass(/.*fill-red-600.*/);

    // And after a reload, it's still filled.
    await page.reload();
    await expect(favoriteBtn.locator('svg')).toHaveClass(/.*fill-red-600.*/);
});
