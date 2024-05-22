import {expect, test} from '@playwright/test';
import {standings_response} from "../har/responses";

test('shows empty view when visiting for the first time', async ({page}) => {
    // Given no favorites, when visiting the favorites page.
    await page.goto('http://localhost:4173/user/favorite-teams');

    // An empty view is shown.
    await expect(page.getByRole('heading', {name: 'No favorites'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Explore teams'})).toBeVisible();
});

test('favorite teams are displayed', async ({page}) => {
    // Given favorites.
    await page.route("**/v4/competitions/CL/standings", async req => req.fulfill({json: standings_response}));
    await page.goto('http://localhost:4173/leagues/CL');
    await page.locator('tr > td > button').nth(0).click();
    await page.locator('tr > td > button').nth(1).click();
    await page.locator('tr > td > button').nth(2).click();

    // When visiting the favorites page.
    await page.goto('http://localhost:4173/user/favorite-teams');

    // They show up.
    await expect(page.locator('div > div > p', {hasText: 'FC Bayern München'})).toBeVisible();
    await expect(page.locator('div > div > p', {hasText: 'FC København'})).toBeVisible();
    await expect(page.locator('div > div > p', {hasText: 'Galatasaray SK'})).toBeVisible();
});

test('favorite teams persist across reloads', async ({page}) => {
    // Given favorites.
    await page.route("**/v4/competitions/CL/standings", async req => req.fulfill({json: standings_response}));
    await page.goto('http://localhost:4173/leagues/CL');
    await page.locator('tr > td > button').nth(0).click();
    await page.locator('tr > td > button').nth(1).click();
    await page.locator('tr > td > button').nth(2).click();

    // When visiting the favorites page and reloading.
    await page.goto('http://localhost:4173/user/favorite-teams');
    await page.reload();

    // They still show up.
    await expect(page.locator('div > div > p', {hasText: 'FC Bayern München'})).toBeVisible();
    await expect(page.locator('div > div > p', {hasText: 'FC København'})).toBeVisible();
    await expect(page.locator('div > div > p', {hasText: 'Galatasaray SK'})).toBeVisible();
});

test('favorites can be removed', async ({page}) => {
    // Given favorites.
    await page.route("**/v4/competitions/CL/standings", async req => req.fulfill({json: standings_response}));
    await page.goto('http://localhost:4173/leagues/CL');
    await page.locator('tr > td > button').nth(0).click();
    await page.locator('tr > td > button').nth(1).click();
    await page.locator('tr > td > button').nth(2).click();

    // When visiting the favorites page.
    await page.goto('http://localhost:4173/user/favorite-teams');

    // And removing the first team (FC Bayern München).
    await page.locator('ul div > button:has(svg)').first().click();
    await page.getByText('Remove').click();

    // The team no longer shows.
    await expect(page.getByText('FC Bayern München')).toHaveCount(0);

    // And persist after reload.
    await page.reload();
    await expect(page.getByText('FC Bayern München')).toHaveCount(0);
});
