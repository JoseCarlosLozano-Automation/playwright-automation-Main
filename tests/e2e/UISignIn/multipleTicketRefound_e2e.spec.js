import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { FillBookingForm } from '../../../pages/FillBookingForm';
import { UserData } from '../../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('Multiple tickets booking are not eligible for refund', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const fillBooking = new FillBookingForm(page);
    const user = UserData();

    await page.goto(url);

    // Log in
    await loginPage.login(user.Email[1], user.Password);
    await expect(page.locator('span:has-text("Browse Events")')).toBeVisible();

    // Book specific event with multiple ticket
    await page.getByTestId('nav-events').click();
    const eventCard = page.getByTestId('event-card').filter({ hasText: 'World Tech Summit' });
    await eventCard.getByTestId('book-now-btn').click();
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await page.getByRole('button', { name: '+' }).dblclick();
    await fillBooking.bookingFormFiller(user.FullName, user.Email[1], user.Phone);
    await expect(page.locator('.booking-ref')).toBeVisible();
    const bookingRef = await page.locator('.booking-ref').textContent();

    // Navigate to booking detail
    await page.getByRole('button', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL(/\/bookings$/);
    const bookingCard = page.locator('#booking-card').filter({ hasText: bookingRef });
    await bookingCard.getByRole('button', { name: 'View Details' }).click();

    // Validate booking ref
    const bookingRefConfirmed = await page.locator('span', { hasText: bookingRef }).last().textContent();
    const bookingTitle = await page.locator('h1.text-2xl').textContent();
    expect(bookingRefConfirmed?.[0]).toBe(bookingTitle?.[0]);

    // Check refund eligibility
    await page.getByTestId('check-refund-btn').click();
    await expect(page.locator('#refund-spinner')).toBeVisible();
    await expect(page.locator('#refund-spinner')).toBeHidden({ timeout: 6000 });

    //  Validate result
    const refoundResults = page.locator('#refund-result');
    await expect(refoundResults).toBeVisible();
    await expect(refoundResults).toContainText('Not eligible for refund');
    await expect(refoundResults).toContainText('Group bookings (3 tickets) are non-refundable');
});