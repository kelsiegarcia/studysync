const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'StudySync',
    description: 'API documentation for StudySync'
  },
  host: 'localhost:5000',
  schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
