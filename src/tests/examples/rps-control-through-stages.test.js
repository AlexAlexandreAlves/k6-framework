import http from 'k6/http';


// RPS (request per second) control through stages with ramp-up and ramp-down
export const options = {
    stages: [
        { duration: '2m', target: 100 }, // Ramp-up to 100 users over 2 minutes
        { duration: '5m', target: 100 }, // Stay at 100 users for 5 minutes
        { duration: '2m', target: 0 },   // Ramp-down to 0 users over 2 minutes
    ],
}

export default function () {
    http.get('https://test.k6.io');
}
