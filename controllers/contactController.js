const Contact = require('../models/contactModel');

const defaultPageSize = 10

// Create
const createContact = async (req, res) => {
    try {
      const contact = new Contact(req.body);
      const savedContact = await contact.save();
      res.status(201).json(savedContact);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Read all Contact with pagination
const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || defaultPageSize;

    let query = {}; // Initialize an empty query object
    const totalCount = await Contact.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const contacts = await Contact.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  res.json({
    contacts,
    page,
    pageSize,
    totalCount,
    totalPages,
  });
} catch (error) {
  res.status(500).json({ error: error.message });
}
};

// Read a single contact by ID
const getContactById = async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update
const updateContact = async (req, res) => {
    try {
      const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete
const deleteContact = async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      res.json({ message: 'Contact deleted successfully', contact });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

module.exports = {
createContact,
getContacts,
updateContact,
deleteContact,
getContactById
};