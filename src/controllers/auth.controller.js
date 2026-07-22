import User from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, email, and password are required validation fields',
      });
    }

    // 2. Reject duplicate email addresses
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email address already exists/registered',
      });
    }

    // 3. Create user (password will be hashed via Mongoose pre-save hook)
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // 4. Return response
    return res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
};
