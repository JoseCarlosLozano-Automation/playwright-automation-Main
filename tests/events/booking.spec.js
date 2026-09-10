import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { FillBookingForm } from '../../pages/FillBookingForm';
import { GetSeatsCount } from '../../helpers/GetSeatsCount';
import { UserData } from '../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('User can book an event', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const fillBooking = new FillBookingForm(page);
    const getSeats = new GetSeatsCount(page);
    const user = UserData();

    await page.goto(url);

    await loginPage.login(user.Email[4], user.Password);

    await page.getByTestId('nav-events').click();
    await getSeats.clickBookNow("Dilli Diwali Mela");
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await fillBooking.bookingFormFiller(user.FullName, user.Email[0], user.Phone);

    await expect(page.locator('.booking-ref')).toBeVisible();
});