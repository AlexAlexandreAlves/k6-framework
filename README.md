# k6 REST Test Framework

This project provides a modular architecture for REST API testing using [k6](https://k6.io/). It helps organize test scenarios, input data, and reporting in a scalable and maintainable way.

## Folder Structure

```
calendar-date-automation-test
├── src
│   ├── auth/
│   ├── config/
│   ├── constants/
│   ├── core/
│   │   └── request-rest-base.js
│   ├── json-objects/
│   │   ├── activities/
│   │   └── authors/
│   ├── requests/
│   │   ├── activities/
│   │   └── authors/
│   ├── resources
│   │   ├── csv/
│   │   ├── json/
│   │   └── txt/
│   ├── tests/
│   │   ├── activities/
│   │   └── authors/
│   └── utils/
├── .gitignore
└── README.md
```

## Main Components

- src/core/request-rest-base.js

Base class for REST requests, supporting GET, POST, PUT, DELETE, authentication, and header configuration.

- src/requests/activities/post-activities.js

Example implementation of a POST request using a JSON template.

- src/utils/utils.js

Utilities for reading CSV and TXT files for test data.

- src/json-objects/

Payload templates for requests, making test parameterization easy.

- src/tests/activities/post-activities.test.js

k6 test script that runs load scenarios and generates an HTML report.

## How to Run

1. Install [k6](https://k6.io/docs/getting-started/installation/) on your machine.
2. Set required environment variables, such as `BASE_URL` and `TOKEN`.
3. Run a test as the example with:

```sh
cd src\tests\activities
k6 run post-activities.js
```

## Reporting
After execution, an HTML report is automatically generated (e.g., report.html).

## Customization
- Add new JSON templates in src/json-objects/.
- Implement new requests in src/requests/.
- Create new test scenarios in src/tests/.

## References
- k6 Documentation
- k6 Reporter