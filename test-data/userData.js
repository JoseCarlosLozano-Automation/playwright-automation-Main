import { faker } from '@faker-js/faker';

// Still not used emails > 13 to 14    
export const UserData = () => {

    const randomDateTime = () => {
        const start = new Date();
        const end = new Date(2027, 11, 31);

        const randomDate = new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime())
        );

        const year = randomDate.getFullYear();
        const month = String(randomDate.getMonth() + 1).padStart(2, '0');
        const day = String(randomDate.getDate()).padStart(2, '0');

        // Hours between 08:00 and 20:00
        const hour = String(
            faker.number.int({ min: 8, max: 20 })).padStart(2, '0');

        // Minutes in steps of 5
        const minute = String(
            faker.helpers.arrayElement([
                '00', '05', '10', '15', '20',
                '25', '30', '35', '40', '45',
                '50', '55'
            ])
        );

        return `${year}-${month}-${day}T${hour}:${minute}`;
    };

    return {
        Email: ['test@testingmail.com',
                'test1@testingmail.com',
                'test2@testingmail.com',
                'test3@testingmail.com',
                'test4@testingmail.com',
                'test5@testingmail.com',
                'test6@testingmail.com',
                'test7@testingmail.com',
                'test8@testingmail.com',
                'test9@testingmail.com',
                'test10@testingmail.com',
                'test11@testingmail.com',
                'test12@testingmail.com',
                'test13@testingmail.com',
                'test14@testingmail.com'],
        Password: 'Echo123$',
        Event: `Test Event ${Date.now()}`,
        EventDesc: faker.lorem.sentence(),
        City: faker.location.city(),
        Venue: faker.location.streetAddress(),
        Price: faker.number.int({ min: 100, max: 500 }).toString(),
        Seats: faker.number.int({ min: 10, max: 100 }).toString(),
        DateTime: randomDateTime(),
        FullName: faker.person.fullName(),
        Phone: `+91 ${faker.string.numeric(5)} ${faker.string.numeric(5)}`,
        BookingSeat: faker.number.int({ min: 1, max: 5 }).toString()
    };
};