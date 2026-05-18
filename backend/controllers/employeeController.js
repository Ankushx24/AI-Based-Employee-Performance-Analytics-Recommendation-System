const Employee = require('../models/Employee');

exports.addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;
    
    if (performanceScore === undefined) {
      return res.status(400).json({ error: 'Validation error: Missing performance score' });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Error message: Duplicate email' });
    }

    const employee = new Employee({
      name, email, department, skills, performanceScore, experience
    });

    await employee.save();
    res.status(201).json({ message: 'Employee stored successfully', employee });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: `Validation error: ${error.message}` });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.searchEmployee = async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) {
      return res.status(400).json({ error: 'Department query parameter is required' });
    }
    const employees = await Employee.find({ department: new RegExp(department, 'i') });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { performanceScore } = req.body;
    
    const employee = await Employee.findByIdAndUpdate(id, { performanceScore }, { new: true });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    
    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
