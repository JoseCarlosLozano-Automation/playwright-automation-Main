import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';
import { CreateEventPage } from '../../../pages/CreateEventPage';
import { EventDetailsValidation } from '../../../pages/EventDetailsValidation';
import { UserData } from '../../../test-data/userData';

const url = "https://eventhub.rahulshettyacademy.com";

test('Edit a previously created event - E2E', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createEvent = new CreateEventPage(page);
    const eventValidation = new EventDetailsValidation(page);
    const user = UserData();

    await page.goto(url);

    // Log in
    await loginPage.login(user.Email[11], user.Password);
    await expect(page.locator('span:has-text("Browse Events")')).toBeVisible();

    // Create an event using the +Add New Event button from the Upcoming events page
    await page.getByRole('button', { name: 'Events' }).click();
    await page.getByRole('button', { name: 'Add New Event' }).click();
    await expect(page).toHaveURL(/admin\/events/);

    // Fill in the event details and submit the form
    const eventName = user.Event + " - Edit Test";
    const eventDesc = user.EventDesc;
    const eventCity = user.City;
    const eventVenue = user.Venue;
    const eventDateTime = user.DateTime;
    const eventPrice = user.Price;
    const eventSeats = user.Seats;
    await createEvent.eventFiller(eventName, eventDesc, eventCity, eventVenue, eventDateTime, eventPrice, eventSeats);
    await expect(page.getByText('✓Event created!×')).toHaveText("✓Event created!×");

    // Search for the created event and navigate to its details page;
    const bookingCard = page.getByTestId('event-table-row').filter({ hasText: eventName });
    await bookingCard.getByRole('button', { name: 'Edit' }).click();

    // Validate that the event details are pre-filled in the form with the correct information
    await eventValidation.validateEventDetails(eventName, eventDesc, eventCity, eventVenue, eventDateTime, eventPrice);

    // Edit the event details
    const updatedEventName = eventName + " - UPDATED";
    const updatedEventDesc = eventDesc + " - UPDATED";
    const updatedEventCity = eventCity + " - UPDATED";
    const updatedEventVenue = eventVenue + " - UPDATED";
    const updatedEventDateTime = user.DateTime;
    const updatedEventPrice = (parseInt(eventPrice) + 10).toString();
    const updatedEventSeats = (parseInt(eventSeats) + 20).toString();

    // Validate that the submit button text has changed to "Update Event" when editing an existing event
    await expect(page.getByTestId('add-event-btn')).toHaveText(/Update Event/);

    // Submit the updated event details and validate that the changes are reflected in the event details page
    await createEvent.eventFiller(updatedEventName, updatedEventDesc, updatedEventCity, updatedEventVenue, updatedEventDateTime, updatedEventPrice, updatedEventSeats);
    await expect(page.getByText('✓Event updated!×')).toHaveText("✓Event updated!×");

    // Search for the updated event and navigate to its details page;
    const updatedBookingCard = page.getByTestId('event-table-row').filter({ hasText: updatedEventName });
    await updatedBookingCard.getByRole('button', { name: 'Edit' }).click();

    // Validate that the updated event details are displayed correctly in the form and in the event details page
    await eventValidation.validateEventDetails(updatedEventName, updatedEventDesc, updatedEventCity, updatedEventVenue, updatedEventDateTime, updatedEventPrice);

});