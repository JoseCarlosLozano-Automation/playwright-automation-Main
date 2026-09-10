import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { FillBookingForm } from '../../../pages/FillBookingForm';
import { CreateEventPage } from '../../../pages/CreateEventPage';
import { UserData } from '../../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('Festival category search - Results', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const fillBooking = new FillBookingForm(page);
    const createEvent = new CreateEventPage(page);
    const user = UserData();
    const categorySelected = 'Festival';

    await page.goto(url);

    await loginPage.login(user.Email[10], user.Password);

    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();

    // Create an event with Festival category
    await page.getByLabel('Category*').selectOption(categorySelected);
    await createEvent.eventFiller(user.Event, user.EventDesc, user.City, user.Venue, user.DateTime, user.Price, user.Seats);
    
    // Search for the event using the category filter
    await page.getByTestId('nav-events').click();
    await page.getByRole('combobox').first().selectOption(categorySelected  );

    // Verify that all the events listed are of the Festival category only
    const eventCards = page.getByTestId('event-card');
    const count = await eventCards.count();

    for (let i = 0; i < count; i++) {
        const category = eventCards.nth(i).locator('span').first();
        await expect(category).toHaveText(categorySelected);
    }
    
});