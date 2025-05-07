// check if new user & email already exists in database
//  if new user, create new uer in db
//  if new user exists, don't create --> error handling to display to user that user exists

const db = require('../db/db');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await db.get(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingUser) {
            return res.status(409).json({ 
                error: 'User already exists with this email' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        await db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                username,
                email
            }
        });
        
    } catch (error) {
        console.error('User exists:', error);
        res.status(500).json({ 
            error: 'User exists' 
        });
    }
};

module.exports = {
    registerUser
};