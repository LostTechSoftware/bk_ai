const httpContext = require('express-http-context')

const getRequestId = () => {
  return httpContext.get('requestId')
}

module.exports = getRequestId
