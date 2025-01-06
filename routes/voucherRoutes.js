const express = require('express');
const db = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
  const query = 'SELECT * FROM vouchers';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

router.get('/active', (req, res) => {
  const currentDate = new Date().toISOString().split('T')[0]; 
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

router.get("/filtered", (req, res) => {
  const { search, status, start, end } = req.query;

  let query = "SELECT * FROM vouchers WHERE 1=1";
  const params = [];

  if (search) {
    const columnsQuery = `PRAGMA table_info(vouchers)`;
    db.all(columnsQuery, [], (err, columns) => {
      if (err) return res.status(500).json({ error: "Error retrieving table info." });

      const searchableColumns = columns.map((col) => col.name);
      const searchConditions = searchableColumns
        .map((col) => `${col} LIKE ?`)
        .join(" OR ");
      query += ` AND (${searchConditions})`;

      for (const col of searchableColumns) {
        params.push(`%${search}%`);
      }

      buildAndRunQuery();
    });
    return;
  }

  if (status) {
    query += " AND status_voucher = ?";
    params.push(status);
  }

  if (start) {
    query += " AND tanggal_mulai <= ?";
    params.push(start);
  }

  if (end) {
    query += " AND tanggal_akhir >= ?";
    params.push(end);
  }

  function buildAndRunQuery() {
    db.all(query, params, (err, rows) => {
      if (err) return res.status(500).json({ error: "Database query error." });
      res.json(rows);
    });
  }

  buildAndRunQuery();
});

router.get("/kode/:kode_voucher", (req, res) => {
  const { kode_voucher } = req.params;

  const query = "SELECT * FROM vouchers WHERE kode_voucher = ?";
  db.get(query, [kode_voucher], (err, row) => {
    if (err) return res.status(500).json({ error: "Database query error." });

    if (!row) {
      return res.status(404).json({ error: "Voucher not found." });
    }

    res.json(row);
  });
});

module.exports = router;
