var express = require('express');
var router = express.Router();
const expressionToTree = require('../expression.js');
console.log(expressionToTree);

router.post('/', function(req, res, next) {
  const data = req.body;
  console.log(data);
  res.json({});
});

router.get('/', function(req, res, next) {
  res.send('Hello from store');
});

module.exports = router;
