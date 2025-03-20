import {test, expect} from '@playwright/test';

test.describe('Register', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('http://localhost:3001/register');
    });

    test('should register successfully with valid credentials', async ({page}) => {
        await page.fill('#reg_username', 'sonaltest');
        await page.fill('#reg_password', 'password');

        await page.click('#reg_btn');

        const snackbar = await page.locator('#snackbar');
        await expect(snackbar).toContainText('Registration successful!');
    });

    test('Navigate to login page', async ({page}) => {
        await page.fill('#reg_username', 'sonaltest');
        await page.fill('#reg_password', 'password');

        await page.click('#reg_btn');

        const snackbar = await page.locator('#snackbar');
        await expect(snackbar).toContainText('Registration successful!');

        await expect(page).toHaveURL('http://localhost:3001/login');
    });
});

