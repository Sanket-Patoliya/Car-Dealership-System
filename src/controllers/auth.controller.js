import { registerUser, loginUser } from '../services/auth.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Delegate business logic to the service layer
  const newUser = await registerUser({ name, email, password, role });

  // Format and return the HTTP response
  return res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    },
  });
});

export const login = catchAsync(async (req, res) => {
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
        role: user.role,
      },
    },
  });
});
