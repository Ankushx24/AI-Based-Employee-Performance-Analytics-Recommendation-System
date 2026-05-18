const axios = require('axios');
const Employee = require('../models/Employee');

exports.getRecommendations = async (req, res) => {
  try {
    const { employeeIds } = req.body;
    
    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of employee IDs' });
    }

    const employees = await Employee.find({ _id: { $in: employeeIds } });
    if (employees.length === 0) {
      return res.status(404).json({ error: 'Employees not found' });
    }

    const prompt = `
    You are an expert HR AI Assistant. Analyze the following employee data and provide specific recommendations based on these rules:
    1. For high performance employees (score >= 80), suggest promotion or leadership roles.
    2. For low score employees (score < 60), provide improvement feedback.
    3. If an employee has less than 3 skills, suggest skill enhancement recommendations.
    4. If multiple employees are provided, rank them based on performance score and experience.
    
    Employee Data:
    ${JSON.stringify(employees, null, 2)}
    
    Provide a well-structured JSON response. Format:
    {
      "recommendations": [
        {
          "employeeId": "string",
          "name": "string",
          "feedback": "string",
          "actionPlan": "string"
        }
      ],
      "ranking": ["employeeId1", "employeeId2"] // optional, only if multiple employees
    }
    `;

    // Make request to OpenRouter (or OpenAI)
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // default to a fast model
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5000',
          'X-Title': 'Employee Performance Analytics',
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = JSON.parse(response.data.choices[0].message.content);
    res.json(aiResponse);

  } catch (error) {
    console.error('AI API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate AI recommendations' });
  }
};
