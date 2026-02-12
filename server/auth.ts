import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User } from "@shared/schema";

export function configurePassport() {
  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user ?? null);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !user.password_hash) {
            return done(null, false, { message: "Invalid email or password" });
          }
          const ok = await bcrypt.compare(password, user.password_hash);
          if (!ok) return done(null, false, { message: "Invalid email or password" });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (googleClientId && googleClientSecret) {
    const baseUrl = process.env.PUBLIC_APP_URL || "http://localhost:5000";
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`,
          scope: ["profile", "email"],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            const name = profile.displayName ?? email ?? "";
            const avatar = profile.photos?.[0]?.value;
            const googleId = profile.id;

            let user = await storage.getUserByGoogleId(googleId);
            if (user) return done(null, user);

            if (email) user = await storage.getUserByEmail(email);
            if (user) {
              // Link Google to existing email account (optional: update user with google_id)
              (user as { google_id?: string }).google_id = googleId;
              // MemStorage doesn't support update; for now we just log in the existing user
              return done(null, user);
            }

            user = await storage.createUser({
              email: email || `google-${googleId}@placeholder.local`,
              password_hash: null,
              google_id: googleId,
              name,
              avatar_url: avatar ?? null,
            });
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }
}

/** Return safe user for API (no password_hash) */
export function toSafeUser(user: User): { id: string; email: string; name: string; avatar_url: string | null } {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? "",
    avatar_url: user.avatar_url ?? null,
  };
}
