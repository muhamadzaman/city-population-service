# City Population Service

City Population Service is a web application that allows users to retrieve and update population data for cities in different states. It uses a MongoDB database to store and manage city population information.

## Features

- Retrieve population data for a city in a state.
- Update population data for a city in a state.
- Handle invalid population values gracefully.
- Store city population data efficiently using MongoDB.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js: Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

## Getting Started

To get this project up and running, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/city-population-service.git

2.  Change to the project directory:

  ```bash
  cd city-population-service

3.  Install project dependencies:
  
  ```bash
  npm install

4. Create a configuration file for your MongoDB connection. You can name it config/database.js and define your MongoDB URI like this:
  
  ```bash
  module.exports = {
    url: 'mongodb://localhost:27017/city_population_db', ///Replace the URI with your actual MongoDB connection string.
  }; 

5.  Now migrate the data from csv to db for fast api response

  ```bash
  npm run migrate-csv-to-db

6.  Start the Fastify server:

  ```bash
  npm start

## Usage

### Retrieving Population Data
1.  To retrieve population data for a city, make a GET request to the following endpoint:

  ```bash
  GET /api/population/state/:state/city/:city
  
  Replace :state and :city with the desired state and city names.

  Example:
  ```bash
  GET /api/population/state/California/city/Los%20Angeles

### Updating Population Data
1.  To update population data for a city, make a PUT request to the following endpoint:

  ```bash
  PUT /api/population/state/:state/city/:city

  Replace :state and :city with the desired state and city names. Provide the new population value in the request body as JSON.

  Example:
  ```bash
  PUT /api/population/state/California/city/Los%20Angeles

Request Body: { "population": 4000000 }
