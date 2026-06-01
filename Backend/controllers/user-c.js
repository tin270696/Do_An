import * as userService from '../services/user-s.js';

// [GET] /api/v1/users/profile
export async function getProfile(req, res) {
  try {
    const user = await userService.getProfile(req.user.id);
    return res.ok({user});
  } catch (error) {
    return res.error(error);
  }
}