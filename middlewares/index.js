const handleErrorResponse = require('./error.message.middleware');
const validator = require('./validator.middleware');
const authentication = require('./authentication.middleware');

module.exports = { handleErrorResponse, validator, authentication };
