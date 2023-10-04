const fastify = require('fastify')({ logger: false });
const populationController = require('./controllers/populationControllers');

fastify.register(populationController);

fastify.listen({port: 5555}, (err, address) => {
  if (err) {
    console.error(`Error starting server: ${err}`);
    process.exit(1);
  }
  console.log(`Server is listening at ${address}`);
});
