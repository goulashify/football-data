import {expect, test} from '@playwright/test';
import {team_response} from './har/responses';


test('displays players', async ({page}) => {
    // Given a competiton.
    await page.route("**/v4/teams/5", async req => req.fulfill({json: team_response}));

    // When visiting the competition page.
    await page.goto('http://localhost:4173/teams/5');

    // The team's name is displayed.
    await expect(page.getByRole('heading', {name: team_response.name})).toBeVisible();

    // The players are displayed.
    await expect(page.locator('tr > td', {hasText: team_response.squad[0].name})).toBeVisible();
    await expect(page.locator('tr > td', {hasText: team_response.squad[team_response.squad.length - 1].name})).toBeVisible();
});

