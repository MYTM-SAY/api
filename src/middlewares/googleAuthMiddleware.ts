// src/auth/googleStrategy.ts
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();  

const clientID: string = process.env.GOOGLE_CLIENT_ID!;
const clientSecret: string = process.env.GOOGLE_CLIENT_SECRET!;

// add a PORT variable to the .env file
const port: string = process.env.PORT!; 
const callbackURL = process.env.GOOGLE_CALLBACK_URL ?? `http://localhost:${port}/api/v1/auth/google/callback`; // TODO: a PORT variable should be added

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
      passReqToCallback: false,                   
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
      try {
    
        done(null, profile); 
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  )
);

