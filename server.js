const express = require('express');
const bodyParser = require('body-parser');
const voucherRoutes = require('./routes/voucherRoutes');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/vouchers', voucherRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
