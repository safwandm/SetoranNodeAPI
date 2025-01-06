const express = require('express');
const db = require('../database');
const router = express.Router();

// === GET ALL VOUCHERS ===
router.get('/', (req, res) => {
  const query = 'SELECT * FROM vouchers';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// === GET ACTIVE VOUCHERS ===
router.get('/active', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date
  const query = `
    SELECT * FROM vouchers
    WHERE status_voucher = 'aktif'
      AND tanggal_mulai <= ?
      AND tanggal_akhir >= ?`;

  db.all(query, [currentDate, currentDate], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// === CREATE A NEW VOUCHER ===
router.post('/', (req, res) => {
  const { nama_voucher, status_voucher, tanggal_mulai, tanggal_akhir, persen_voucher, kode_voucher } = req.body;
  const query = `
    INSERT INTO vouchers (nama_voucher, status_voucher, tanggal_mulai, tanggal_akhir, persen_voucher, kode_voucher)
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(query, [nama_voucher, status_voucher, tanggal_mulai, tanggal_akhir, persen_voucher, kode_voucher], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Voucher created successfully' });
  });
});

// === UPDATE VOUCHER ===
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nama_voucher, status_voucher, tanggal_mulai, tanggal_akhir, persen_voucher, kode_voucher } = req.body;
  const query = `
    UPDATE vouchers
    SET nama_voucher = ?, status_voucher = ?, tanggal_mulai = ?, tanggal_akhir = ?, persen_voucher = ?, kode_voucher = ?
    WHERE id_voucher = ?`;

  db.run(query, [nama_voucher, status_voucher, tanggal_mulai, tanggal_akhir, persen_voucher, kode_voucher, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.json({ message: 'Voucher updated successfully' });
  });
});

// === DELETE VOUCHER ===
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM vouchers WHERE id_voucher = ?';

  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    res.json({ message: 'Voucher deleted successfully' });
  });
});

module.exports = router;
