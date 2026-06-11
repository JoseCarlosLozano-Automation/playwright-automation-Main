class EcommerceAPIClient {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post(
            "https://api.eventhub.rahulshettyacademy.com/api/auth/login",
            {
                data: this.loginPayload
            }
        );

        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        return token;
    }

    async createEvent(eventPayload) {

        let response = {};
        response.token = await this.getToken();

        const eventResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: eventPayload,
            headers: {
                "Authorization": response.token,
                "Content-Type": "application/json"
            }
        });

        const eventResponseJson = await eventResponse.json();
        const eventId = eventResponseJson.eventId;
        response.eventId = eventId;
        return response;
    }
}

module.exports = {EcommerceAPIClient};