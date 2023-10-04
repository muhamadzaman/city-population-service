const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const csv = require('csv-parser');
const { url } = require('../config/database'); // Adjust the path to your database configuration
const State = require('../models/CityPopulation');

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const batchSize = 3000; // Set your desired batch size
let batch = [];
let rowCount = 0;
  
const delayBetweenInserts = 1000; // Set your desired delay in milliseconds

async function processBatch() {
  if (batch.length === 0) return;

  try {
    await State.collection.insertMany(batch);
    batch = [];
    console.log(`Processed ${rowCount} rows`);
  } catch (error) {
    console.error('Error migrating data:', error);
    process.exit(1);
  }

  // Introduce a delay between batch insertions
  await new Promise((resolve) => setTimeout(resolve, delayBetweenInserts));

  processBatch(); // Process the next batch
}

(async () => {
  try {
    const csvFilePath = path.join(__dirname, '../data/city_populations.csv');
    const stream = fs.createReadStream(csvFilePath, 'utf-8');

    stream
      .pipe(csv())
      .on('data', async (row) => {
        const city = row.City;
        const population = parseInt(row.Population, 10); // Parse population as an integer
        const state = row.State;

        if (!isNaN(population)) {
          // Check if population is an integer
          if (!batch[state]) {
            batch[state] = { stateName: state, cityData: new Map() };
          }

          batch[state].cityData.set(city, { city, population });
        } else {
          console.warn(`Skipping invalid record (row ${rowCount + 1}): ${JSON.stringify(row)}`);
        }

        if (Object.keys(batch).length >= batchSize) {
          await processBatch();
        }

        rowCount++;
      })
      .on('end', async () => {
        // Insert any remaining rows
        await processBatch();

        console.log(`Data migrated successfully. Total rows processed: ${rowCount}`);
        process.exit(0);
      })
      .on('error', (error) => {
        console.error('Error migrating data:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('Error migrating data:', error);
    process.exit(1);
  }
})();
