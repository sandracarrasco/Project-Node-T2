const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'El servidor está funcionando correctamente 🚀',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
