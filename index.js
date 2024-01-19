const express = require('express');
const httpProxy = require('http-proxy');
const rTracer = require('cls-rtracer')

const app = express();
const CLICKUP_API_BASE_URL = 'https://api.clickup.com/api/v2';

const proxy = httpProxy.createProxyServer({
  ignorePath: true,
});
app.use(rTracer.expressMiddleware())


// Add event listeners to the proxy instance
proxy.on('proxyReq', (proxyReq, req, res, options) => {

  console.log('Proxy Request:');
  console.log(`- Method: ${req.method}`);
  console.log(`- Path: ${req.originalUrl}`);
  console.log(`- Headers: ${JSON.stringify(proxyReq.getHeaders())}`);
  console.log(`- Body: ${JSON.stringify(proxyReq.body)}`);
});

proxy.on('proxyRes', (proxyRes, req, res) => {
  // console.log('Proxy Response:');
  // console.log(`- Status Code: ${proxyRes.statusCode}`);
  // console.log(`- Headers: ${JSON.stringify(proxyRes.headers)}`);
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE', 'OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.all('/*', async (req, res) => {
  // console.log(`Incoming Request:`);
  // console.log(`- Path: ${req.originalUrl}`);
  // console.log(`- Method: ${req.method}`);
  // console.log(`- Headers: ${JSON.stringify(req.headers)}`);
  // console.log(`- Query Params: ${JSON.stringify(req.query)}`);
  // console.log(`- Body: ${JSON.stringify(req.body)}`);

  const apiUrl = `${CLICKUP_API_BASE_URL}/${req.params[0].replace("clickup","")}`; // Combine base URL with requested endpoint
  const requestOptions = {
    method: req.method,
    url: apiUrl,
    headers: req.headers,
  };

  if (req.method === 'GET') {
    requestOptions.params = req.query;
  }

  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    requestOptions.data = req.body;
  }

  // console.log(`Forwarding Request to ${apiUrl}`);
  // console.log(`- Method: ${requestOptions.method}`);
  // console.log(`- Headers: ${JSON.stringify(requestOptions.headers)}`);
  // console.log(`- Query Params: ${JSON.stringify(requestOptions.params)}`);
  // console.log(`- Body: ${JSON.stringify(requestOptions.data)}`);
  proxy.web(req, res, { target: apiUrl, changeOrigin: true }, (error) => {
    res.status(500).send('An error occurred: ' + error.message);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
