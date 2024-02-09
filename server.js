// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

let inventory = [
  { id: 1, name: 'Product 1', quantity: 10 },
  { id: 2, name: 'Product 2', quantity: 20 }
];

let paymentAccounts = [
  { id: 1, name: 'Account 1', balance: 1000 },
  { id: 2, name: 'Account 2', balance: 2000 }
];

// Inventory management APIs
app.get('/api/inventory', (req, res) => {
  res.json(inventory);
});

app.post('/api/inventory', (req, res) => {
  const newItem = req.body;
  inventory.push(newItem);
  res.status(201).json(newItem);
});

app.delete('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  inventory = inventory.filter(item => item.id !== parseInt(id));
  res.status(200).json({ message: 'Item deleted successfully' });
});

// Payment account management APIs
app.get('/api/payment-accounts', (req, res) => {
  res.json(paymentAccounts);
});

app.post('/api/payment-accounts', (req, res) => {
  const newAccount = req.body;
  paymentAccounts.push(newAccount);
  res.status(201).json(newAccount);
});

app.delete('/api/payment-accounts/:id', (req, res) => {
  const { id } = req.params;
  paymentAccounts = paymentAccounts.filter(account => account.id !== parseInt(id));
  res.status(200).json({ message: 'Account deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
