import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { CreateEventPage } from '../../../pages/CreateEventPage';
import { FillBookingForm } from '../../../pages/FillBookingForm';
import { GetSeatsCount } from '../../../helpers/GetSeatsCount';
import { UserData } from '../../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('Full creation, booking and valiation of an event event - E2E', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createEvent = new CreateEventPage(page);
    const fillBooking = new FillBookingForm(page);
    const getSeats = new GetSeatsCount(page);
    const user = UserData();

    await page.goto(url);

    // Log in
    await loginPage.login(user.Email[0], user.Password);
    await expect(page.locator('span:has-text("Browse Events")')).toBeVisible();

    // Create an event
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();
    await expect(page).toHaveURL(/admin\/events/);
    await createEvent.eventFiller(user.Event, user.EventDesc, user.City, user.Venue, user.DateTime, user.Price, user.Seats);
    await expect(page.getByText('✓Event created!×')).toHaveText("✓Event created!×");

    // Get the seats count before booking
    await page.getByTestId('nav-events').click();
    const seatsBeforeBooking =  await getSeats.seatsCount(user.Event);

    // Pre booking
    await getSeats.clickBookNow(user.Event);

    // Booking
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await fillBooking.bookingFormFiller(user.FullName, user.Email[0], user.Phone);

    // Getting the booking ref
    await expect(page.locator('.booking-ref')).toBeVisible();
    const bookingRef = await page.locator('.booking-ref').textContent();

    // Booking validation
    await page.getByRole('button', {name: 'View My Bookings'}).click();
    await expect(page).toHaveURL(/\/bookings$/);
    const bookingCards = page.locator('#booking-card');
    await expect(bookingCards.first()).toBeVisible();
    const bookingCard = bookingCards.filter({ hasText: bookingRef });
    await expect(bookingCard).toBeVisible();
    await expect(bookingCard.locator('h3')).toHaveText(user.Event);

    // Last comparation, before and after booking
    await page.getByTestId('nav-events').click();
    const seatsAfterBooking = await getSeats.seatsCount(user.Event); 
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});