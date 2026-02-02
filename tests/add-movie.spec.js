const { test, expect } = require('@playwright/test');
const movies = require('./test-data/movies.json');

for (const movie of movies) {
  test(`Add movie: ${movie.movieName}`, async ({ page }) => {
    await page.goto('http://localhost:3000');

    const uniqueMovieName = `${movie.movieName}-${Date.now()}`;

    await page.getByLabel('MovieName').fill(uniqueMovieName);
    await page.getByLabel('Hero').fill(movie.hero);
    await page.getByLabel('Collection').fill(movie.collection);

    await page.getByLabel(movie.status).check();

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Saved successfully')).toBeVisible();

    await page.getByRole('button', { name: 'List All' }).click();

    const row = page.locator('table tr', { hasText: uniqueMovieName });
    await expect(row).toBeVisible();
  });
}