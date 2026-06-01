import * as authService from '../services/auth-s.js';

// [POST] /api/v1/auth/signup
export async function signup(req, res) {
  try {
    const result = await authService.signup(req.body);
    return res.created({
      user: result.user,
      accessToken: result.accessToken,
      expiresIn: {
        accessToken: result.accessTokenExpiresIn,
      }
    });
  } catch (error) {
    return res.error(error);
  }
}

// [POST] /api/v1/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.ok({
      user: result.user,
      accessToken: result.accessToken,
      expiresIn: {
        accessToken: result.accessTokenExpiresIn,
      }
    });
  } catch (error) {
    return res.error(error);
  }
}

// [POST] /api/v1/auth/logout
export async function logout(req, res) {
  try {
    return res.ok({ message: 'Logged out successfully' });
  } catch (error) {
    return res.error(error);
  }
}

// [GET] /api/v1/auth/me
export async function me(req, res) {
  try {
    const user = { ...req.user };
    delete user.password;
    return res.ok({ user });
  } catch (error) {
    return res.error(error);
  }
}