const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rTracer = require('cls-rtracer')

const app = express();
const CLICKUP_API_BASE_URL = 'https://api.clickup.com/api/v2';

app.use(rTracer.expressMiddleware());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE', 'OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Define the proxy middleware
const apiProxy = createProxyMiddleware({
  target: CLICKUP_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/clickup': '', // Remove the "/clickup" prefix from the request URL
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxy Request:');
    console.log(`- Method: ${req.method}`);
    console.log(`- Path: ${req.originalUrl}`);
    console.log(`- Headers: ${JSON.stringify(proxyReq.getHeaders())}`);
    console.log(`- Body: ${JSON.stringify(proxyReq.body)}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // console.log('Proxy Response:');
    // console.log(`- Status Code: ${proxyRes.statusCode}`);
    // console.log(`- Headers: ${JSON.stringify(proxyRes.headers)}`);
  },
});

// Use the proxy middleware
app.use('/clickup/*', apiProxy);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));