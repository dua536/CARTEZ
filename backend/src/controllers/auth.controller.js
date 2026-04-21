const { query } = require('../../db');
const jwt = require('jsonwebtoken');

function mapUserForResponse(user) {
  return {
    id: user.ID,
    firstName: user.FIRST_NAME,
    lastName: user.LAST_NAME,
    email: user.EMAIL,
    role: user.ROLE,
  };
}

function createAuthToken(user) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      id: user.ID,
      email: user.EMAIL,
      role: user.ROLE,
      firstName: user.FIRST_NAME,
      lastName: user.LAST_NAME,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const normalizedFirstName = String(firstName || '').trim();
    const normalizedLastName = String(lastName || '').trim();

    if (!normalizedFirstName || !normalizedLastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'firstName, lastName, email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUsers = await query(
      `SELECT id FROM users WHERE email = :email`,
      { email: normalizedEmail }
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    await query(
      `INSERT INTO users (first_name, last_name, email, password)
       VALUES (:fn, :ln, :email, :pw)`,
      {
        fn: normalizedFirstName,
        ln: normalizedLastName,
        email: normalizedEmail,
        pw: String(password),
      }
    );

    const createdUsers = await query(
      `SELECT id, first_name, last_name, email, role 
       FROM users 
       WHERE email = :email`,
      { email: normalizedEmail }
    );

    const createdUser = createdUsers[0];

    const token = createAuthToken(createdUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: mapUserForResponse(createdUser),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const users = await query(
      `SELECT id, first_name, last_name, email, role, password 
       FROM users 
       WHERE email = :email`,
      { email: normalizedEmail }
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = users[0];

    if (String(password) !== user.PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = createAuthToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: mapUserForResponse(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
}

module.exports = {
  register,
  login,
  me,
};