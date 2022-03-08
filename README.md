You can find a deployed instance of the app at [https://web-sampler-sniif.ondigitalocean.app](https://web-sampler-sniif.ondigitalocean.app).

![Screenshot of application](docs/images/sample-table.png?raw=true "Screenshot of application")

The application was built using React, Tone.js, Material-UI and Webpack.

# Requirements

- [Node.js](https://nodejs.org/en/) (12.19.0LTS)
- npm (should be installed as part of Node.js)

# Quick Start

- Install [Node.js](https://nodejs.org/en/) with npm
- Run ```npm install``` from the project directory
- Run ```npm dev``` to run the application

# Scripts

Excuted by running ```npm start SCRIPT``` when inside the base project directory.

- ```build``` runs webpack to package Node.js as client code that works on the browser
- ```start``` runs the server, use in deployed instances
- ```dev``` builds and starts the server, use in development
- ```lint``` runs ESLint to check for problems in code
- ```tidy``` runs Prettify to automatically tidy up code formatting
