// Placeholder Lambda handler - will be replaced by NestJS build
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Hello from BUNGHILDA! Portfolio API is working.',
      path: event.path,
      method: event.httpMethod,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'dev',
      dynamodbTable: process.env.DYNAMODB_TABLE_NAME,
      bunghilda: 'Successfully deployed and ready for action!'
    })
  };

  return response;
};