const mongoose = require('mongoose');

// Define a schema for city population data
const cityPopulationSchema = new mongoose.Schema({
  city: String,
  population: Number,
});

// Define a schema for state data
const stateSchema = new mongoose.Schema({
  stateName: String,
  cityData: { type: Map, of: cityPopulationSchema }, // Use a Map to store city population data
});

// Create a model for the state data
const State = mongoose.model('State', stateSchema);

module.exports = State;
