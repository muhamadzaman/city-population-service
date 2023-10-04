const mongoose = require('mongoose');
const State = require('../models/CityPopulation');

module.exports = async (fastify, opts) => {
  fastify.register(require('fastify-cors'), { origin: '*', methods: ['GET', 'PUT'] });

  // GET endpoint to retrieve population data
  fastify.get('/api/population/state/:state/city/:city', async (request, reply) => {
    try {
      const stateName = request.params.state;
      const cityName = request.params.city;

      const state = await State.findOne({ stateName });

      if (!state || !state.cityData.has(cityName)) {
        reply.code(400).send({ error: 'City not found in the database' });
      } else {
        const population = state.cityData.get(cityName).population;
        reply.code(200).send({ population });
      }
    } catch (error) {
      console.error('Error fetching population:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // PUT endpoint to update population data
  fastify.put('/api/population/state/:state/city/:city', async (request, reply) => {
    try {
      const stateName = request.params.state;
      const cityName = request.params.city;
      const population = parseInt(request.body);

      if (isNaN(population)) {
        reply.code(400).send({ error: 'Invalid population value' });
        return;
      }

      let state = await State.findOne({ stateName });

      if (!state) {
        // If the state doesn't exist, create a new one
        state = new State({
          stateName,
          cityData: new Map(),
        });
      }

      // Update or insert the population data for the city
      state.cityData.set(cityName, { city: cityName, population });

      await state.save(); // Save the updated state document

      reply.code(200).send({ message: 'Data updated successfully' });
    } catch (error) {
      console.error('Error updating population:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
};
