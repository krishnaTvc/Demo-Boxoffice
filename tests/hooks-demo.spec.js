const { test, expect } = require('@playwright/test');

test.describe('Movie App Tests with Hooks', () => {

    // 1. Before All: Run once before all tests in this describe block
    test.beforeAll(async () => {
        console.log('Starting Movie App Test Suite...');
        // Setup global state if needed (e.g., seeding DB, though checking network is better)
    });

    // 2. Before Each: Run before every single test
    test.beforeEach(async ({ page }) => {
        console.log(`Running test: ${test.info().title}`);
        await page.goto('http://localhost:3000');
        // Ensure page is ready
        await expect(page.locator('h1')).toHaveText('Demo-Boxoffice');
    });

    // 3. After Each: Run after every single test
    test.afterEach(async ({ page }, testInfo) => {
        console.log(`Finished test: ${testInfo.title} with status ${testInfo.status}`);
        if (testInfo.status !== 'passed') {
            console.log('Test failed, check screenshots/video if configured.');
        }
    });

    // 4. After All: Run once after all tests in this describe block
    test.afterAll(async () => {
        console.log('Completed Movie App Test Suite.');
        // Teardown logic if needed
    });

    test('Add a new movie successfully', async ({ page }) => {
        const movieName = `TestHookMovie-${Date.now()}`;
        const hero = 'Test Hero';
        const collection = '150';

        // Fill form
        await page.getByLabel('MovieName').fill(movieName);
        await page.getByLabel('Hero').fill(hero);
        await page.getByLabel('Collection').fill(collection);
        await page.getByLabel('Running').check();

        // Submit
        await page.getByRole('button', { name: 'Submit' }).click();

        // Verify success message
        await expect(page.locator('#formMessage')).toHaveText('Saved successfully.');
    });

    test('List all movies and verify content', async ({ page }) => {
        // Click "List All"
        await page.getByRole('button', { name: 'List All' }).click();

        // Wait for table to populate (check for at least one row if DB is pre-seeded, 
        // or just check that "No results found" is NOT there if we expect data)
        // Here we just check if the table header is visible which implies the list view is active
        await expect(page.locator('table th').first()).toBeVisible();

        // Verify search message update
        await expect(page.locator('#searchMessage')).toContainText('result(s)');
    });

});
