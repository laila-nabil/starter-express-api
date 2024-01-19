const express = require('express');
const axios = require('axios'); // Replace 'request' with 'axios'

const app = express();
const CLICKUP_API_BASE_URL = 'https://api.clickup.com/api/v2'; // ClickUp API base URL

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

  try {
    // Make the request to the ClickUp API using axios
    const response = await axios(requestOptions);

    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      type: 'error',
      message: error.response ? error.response.data : error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
