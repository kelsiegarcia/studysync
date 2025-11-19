const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'StudySync',
    description: 'API documentation for StudySync'
  },
  host: 'studysync-2sto.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
