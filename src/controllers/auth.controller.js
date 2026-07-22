import { registerUser } from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Delegate business logic to the service layer
    const newUser = await registerUser({ name, email, password });

    // Format and return the HTTP response
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
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: statusCode === 500 ? 'error' : 'fail',
      message: error.message || 'Internal server error',
    });
  }
};
