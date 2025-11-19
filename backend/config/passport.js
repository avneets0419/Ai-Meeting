import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        // 1. Check if user already exists WITH googleId
        let user = await prisma.user.findFirst({
          where: { googleId },
        });

        if (user) {
          // Generate JWT
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );

          return done(null, { ...user, token });
        }

        // 2. Check if user exists by EMAIL (manual signup case)
        const existingByEmail = await prisma.user.findUnique({
          where: { email },
        });

        if (existingByEmail) {
          // Update user -> attach googleId
          user = await prisma.user.update({
            where: { email },
            data: {
              googleId,
              avatar,
            },
          });

          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );

          return done(null, { ...user, token });
        }

        // 3. Create new user if none found
        user = await prisma.user.create({
          data: {
            googleId,
            email,
            name,
            avatar,
            password: null, // no password for Google users
          },
        });

        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, { ...user, token });

      } catch (err) {
        console.error("Google auth error:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;
