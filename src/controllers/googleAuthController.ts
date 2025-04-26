// src/controllers/googleAuthController.ts
import { Request, Response } from 'express';
import passport from 'passport';
import { AuthService } from '../services/authService';
import { ResponseHelper } from '../utils/responseHelper';
import { asyncHandler } from '../utils/asyncHandler';

// redirecting to Google.

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],                  
});


// Handles Google's callback

export const googleAuthCallback = [
  passport.authenticate('google', {               
    session: false,
    failureRedirect: '/auth/google', // TODO : this should be a frontend route
  }),
  asyncHandler(async (req: Request, res: Response) => {
    const profile = req.user ; 

    // Find or create your user and issue tokens
    const { accessToken, refreshToken } = await AuthService.googleLogin(profile);

    return res
      .cookie('accessToken',  accessToken,  { httpOnly: true, secure: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
      .json(ResponseHelper.success('Google auth successful', { accessToken, refreshToken }));
  })
];
