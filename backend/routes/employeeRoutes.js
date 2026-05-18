const express = require('express');
const router = express.Router();
const { addEmployee, getAllEmployees, searchEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addEmployee);
router.get('/', authMiddleware, getAllEmployees);
router.get('/search', authMiddleware, searchEmployee);
router.put('/:id', authMiddleware, updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);

module.exports = router;
