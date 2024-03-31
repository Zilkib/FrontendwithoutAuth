# Clinical Application Project

This is an extension of an project created by [aaron3636](https://github.com/aaron3636) and [GravityDarkLab](https://github.com/GravityDarkLab). The Readme was slightly adapted , all rights belong to them.

Their epositorys of the [FrontEnd](https://github.com/aaron3636/KAPFrontEnd) and [BackEnd](https://github.com/aaron3636/KAP).

Welcome to the Clinical Application Project! This project comprises a server and a client application designed to streamline the testing of clinical data resources. The server is built upon the open-source [Hapi-FHIR](https://hapifhir.io/) project.



## Table of Contents

- [Introduction](#introduction)
- [Frontend Integration](frontend-integration)
- [Client - PatientGenerator](#client---patientgenerator)
- [Server Configuration](#server-configuration)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Acknowledgment](#acknowledgment)
- [License](#license)

## Introduction

In the context of clinical applications, it is crucial to have a reliable and easy-to-use environment for testing different resources. This project aims to provide a practical solution for testing a server with clinical data resources. The server, based on Hapi-FHIR, offers various RESTful endpoints.

## Backend Integration

This frontend repository is designed to seamlessly integrate with the server component of the project. Together, they offer a comprehensive solution for clinical application testing, providing a user-friendly interface to interact with the clinical data resources.

Feel explore the [BackEnd](https://github.com/Zilkib/BackendwithoutAuth) to leverage the full potential of the Klinisches Anwendungsprojekt. The frontend enhances the overall user experience and complements the functionality of the server.

## Client - PatientGenerator

The `PatientGenerator-client` is a mock client application designed to generate random patient data and interact with the server through HTTP requests. This allows users to simulate real-world scenarios and test the server's handling of different resources. The client is a valuable tool for validating the server's functionality and performance.

## Server Configuration

The `server` directory contains the Hapi-FHIR-based server, which serves as the core component of this project. 

## Getting Started

1. **Install Node.js:**
   Before installing npm, you need to have Node.js installed on your machine. npm is the default package manager that comes with Node.js. If you don't have Node.js installed, you can download and install it from the official Node.js website: https://nodejs.org/

2. **Verify Installation:**
   After installing Node.js, you can check if npm is installed by opening your terminal or command prompt and running the following commands:
   ```
   node -v
   npm -v
   ```
   These commands will display the installed versions of Node.js and npm, respectively.

To get started with the Clinical Project, follow these steps:

1. **Clone the Repository:** Begin by cloning this repository to your local machine using the following command:
   ```
   git clone https://github.com/Zilkib/BackendwithoutAuth.git
   git clone https://github.com/Zilkib/FrontendwithoutAuth.git
   ```

2. **Configure the Server:** Navigate to the `server` directory and follow the provided instructions to set up and configure the server. Ensure that you have all the required dependencies installed.

3. **Build the PatientGenerator:** Next, go to the `PatientGenerator-client` directory. If needed, update the configurations to match your server's endpoint. Then, build the client application and you can now start testing the server's response to various resources and HTTP methods.

4. **Prepare the Frontend:** Navigate to the front-end directory and install the required dependencies using npm:
   ```
   npm install
   ```

5. **Run the Development Server:** Start the development server by running the following command:
   ```
   npm start
   ```
   The app will be accessible at http://localhost:3000 in your web browser.

## Usage

By following these steps, you will have both the backend server and the frontend application up and running, enabling seamless interaction with the clinical data resources. Should you have any questions or need assistance, feel free to reach out. Happy testing!

## Acknowledgment

Special thanks to [aaron3636](https://github.com/aaron3636) and [GravityDarkLab](https://github.com/GravityDarkLab).
## License

The Klinisches Anwendungsprojekt is distributed under the [MIT License](LICENSE). You are free to use, modify, and distribute the code as per the terms of the license.

---

Thank you for your interest in the Klinisches Anwendungsprojekt. If you have any questions or need further assistance, please don't hesitate to reach out to me. Happy testing!
