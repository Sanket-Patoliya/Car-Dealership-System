import { registerUser, loginUser } from '../services/auth.service.js';

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Delegate business logic to the service layer
    const { user, token } = await loginUser({ email, password });

    // Format and return the HTTP response
    return res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
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

