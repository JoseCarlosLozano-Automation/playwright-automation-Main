export async function waitForApi(page, endpoint, method = 'GET', status = 200) {
    try {
        await page.waitForResponse(response =>
            response.url().includes(endpoint) &&
            response.status() === status &&
            response.request().method() === method
        );

        return true;
    } catch {
        return false;
    }
}