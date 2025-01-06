const express = require('express');
const bodyParser = require('body-parser');
const voucherRoutes = require('./routes/voucherRoutes');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api/voucher', voucherRoutes);

app.listen(port, () => {
  console.log(`Server sudah berjalan: http://localhost:${port}`);
});
