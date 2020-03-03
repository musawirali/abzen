import { Express } from 'express';
import passport from 'passport';
import { Strategy, VerifyFunction } from 'passport-local';
import { User } from '../models/User';

/**
 * Credentials verification function.
 *
 * @param username
 * @param password
 * @param done
 */
export const verifyFunc: VerifyFunction = (username, password, done) => {
  User.findOne({
    where: {
      username,
    },
  }).then((user) => {
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    if (!user.checkPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  }).catch((err) => {
    return done(err);
  });
};

/**
 * Initialize Passport.
 *
 * @param expressApp
 */
export const initAuth = (expressApp: Express) => {
  passport.use(new Strategy(verifyFunc));

  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: number, done) => {
    User.findByPk(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });

  expressApp.use(passport.initialize());
  expressApp.use(passport.session());
};

/**
 * Middleware for authentication.
 */
export const authMiddleware = () => passport.authenticate('local');
