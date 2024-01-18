const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api', async (req, res) => {
 try {
   const response = await axios.get('API_URL');
   res.json(response.data);
 } catch (error) {
   console.error(error);
 }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
