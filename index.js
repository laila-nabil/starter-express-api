const express = require('express');
const httpProxy = require('http-proxy');
const axios = require('axios'); // Replace 'request' with 'axios'

const app = express();
const CLICKUP_API_BASE_URL = 'https://api.clickup.com/api/v2'; // ClickUp API base URL

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Handle different ClickUp API endpoints
app.all('/clickup/*', async (req, res) => {
  console.log(`req.params[0] ${req.params[0]}`);
  console.log(`req.headers ${req.headers}`);
  console.log(`req.method ${req.method}`);
  console.log(`req.headers Authorization ${req.headers["Authorization"]}`);

  const apiUrl = `${CLICKUP_API_BASE_URL}/${req.params[0]}`; // Combine base URL with requested endpoint
  console.log(`apiUrl ${apiUrl}`);
  // Extract relevant details from the incoming request
  const requestOptions = {
    method: req.method,
    url: apiUrl,
    // headers: {
    //   'Content-Type': 'application/json',
    //   // Add any additional headers required for the ClickUp API
    //   // Authorization: 'Bearer YOUR_CLICKUP_API_KEY',
    // },
    headers: req.headers
  };

  // For GET requests, include query parameters
  if (req.method === 'GET') {
    requestOptions.params = req.query;
  }

  // For POST, PUT, and DELETE requests, include the request body
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    requestOptions.data = req.body;
  }
  console.log(`requestOptions.data ${requestOptions.data}`);
  console.log(`requestOptions.params ${requestOptions.params}`);
  console.log(`requestOptions.url ${requestOptions.url}`);
  console.log(`requestOptions.method ${requestOptions.method}`);
  console.log(`requestOptions.url ${requestOptions.url}`);
  
  // Forward the request to the target host
  proxy.web(req, res, { target: apiUrl, changeOrigin: true }, (error) => {
    // Handle any errors from the proxy or the target server
    res.status(500).send('An error occurred: ' + error.message);
  });

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
