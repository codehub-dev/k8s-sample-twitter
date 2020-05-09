const express = require('express');
const tweets = require('./v1/tweets.js');
const timeline = require('./v1/timeline.js');

const router = express.Router();

// swagger
if (process.env.NODE_ENV === 'development') {
  const swaggerJSDoc = require('swagger-jsdoc');
  const options = {
    swaggerDefinition: require('../swagger/swaggerDef.js'),
    apis: [
      './controllers/v1/tweets.js',
      './controllers/v1/timeline.js',
      './swagger/components.yml',
    ],
  };
  const swaggerSpec = swaggerJSDoc(options);
  // CROS
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, DELETE, PUT, PATCH, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
  router.get('/v1/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

router.use('/v1/tweets', tweets);
router.use('/v1/timeline', timeline);

module.exports = router;
