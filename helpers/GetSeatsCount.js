import { expect } from '@playwright/test';
import { waitForApi } from '../utils/waitForApi';

export class GetSeatsCount {
    constructor(page){
        this.page = page;
        this.eventCards = page.getByTestId('event-card');
    }

    async seatsCount(eventName){
        const apiResult = await waitForApi(this.page, '/api/events');
        expect(apiResult).toBe(true);

        const myEventCard = this.eventCards.filter({ hasText: eventName });
        await expect(myEventCard).toBeVisible();

        const seatsText = await myEventCard.locator('span').last().textContent();
        return parseInt(seatsText.match(/\d+/)[0]);
    }

    async clickBookNow(eventName){
        const myEventCard = this.eventCards.filter({ hasText: eventName });
        await expect(myEventCard).toBeVisible();

        await myEventCard.getByTestId('book-now-btn').click();
    }
}