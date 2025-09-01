# k6 REST Test Framework

This project provides a modular architecture for REST API testing using [k6](https://k6.io/). It helps organize test scenarios, input data, and reporting in a scalable and maintainable way.

## Folder Structure

```
calendar-date-automation-test
├── src
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
│   │   └── examples/
│   └── utils/
├── .gitignore
└── README.md
```

## Main Components

- **config:**  
In this folder, we can create every kind of configuration file, such as the env.json that we can set the BASE_URL of the project, or the setup.js that allows us to initialize every env file before run the test.

- **constants:**  
Constant files to use on the test files.

- **core:**  
Here we can find the request-rest-base.js, the main and most important file for this architecture.

- **json-objects:**  
Define the JSON objects to use them in the tests.

- **requests:**  
The request builder files, when we can setup the request structure, defining the method (e.g. GET, POST, PUT), the URL, the endpoint and etc.

- **resources:**  
Resources file to use on the tests, such as *.cvs* or *.txt* files.

- **tests:**  
Folder where our tests have to be created. *In the examples folder, we can find some kind of executors, that can help you to find the best executor when you'll build your test.*

- **utils:**  
Utils files, which we can create generic methods to use in all projects. 

## Architecture

This framework uses the [HTTPX library](https://jslib.k6.io/httpx/) for advanced HTTP client features, such as session management, custom headers, and flexible authentication.  
The base class (`src/core/request-rest-base.js`) is designed to support both the native k6 `http` module and HTTPX, allowing you to switch between them depending on your testing needs.

- **HTTPX Advantages:**  
  - Session persistence across requests  
  - Advanced cookie and header handling  
  - Support for custom authentication flows  
  - Useful for complex API automation scenarios

- **k6 HTTP Module:**  
  - Full integration with k6 metrics and reporting  
  - Recommended for standard load and performance testing

You can easily adapt the framework to use either client by modifying the base class.

k6 test script that runs load scenarios and generates an HTML report.

## Create your test quickly and easily
1. Create the request in the [requests-folder](./src/requests) following the same pattern to the other. If you have to use a POST or a PUT request, make sure to define the request body in [json-objects](./src/json-objects). Don't forget it, if you have to use token validation, make sure to include the token in the request headers through the [env.json](./src/config/env.json) variables.
2. Create a test script in the [tests-folder](./src/tests). This script will import the request and define the test scenario. 

## How to Run

1. Install [k6](https://k6.io/docs/getting-started/installation/) on your machine.
2. Set required environment variables, such as `BASE_URL` and `TOKEN`(if needed).
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
- Add new [assertions](https://grafana.com/docs/k6/latest/using-k6/assertions/), [validations](https://grafana.com/docs/k6/latest/using-k6/checks/) and [metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/) in src/tests/.

## References
- k6 Documentation
- k6 Reporter