import { body, validationResult, matchedData } from 'express-validator';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '../db/queries.js';
import passport from 'passport';

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateSignup = [
  body('firstname')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 25 })
    .withMessage('First name must be 1-25 characters')
    .matches(/^[A-Za-z][A-Za-z\s'-]+$/)
    .withMessage('Invalid first name'),
  body('lastname')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 25 })
    .withMessage('Last name must be 1-25 characters')
    .matches(/^[A-Za-z][A-Za-z\s'-]+$/)
    .withMessage('Invalid last name'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (user) {
        throw new Error('User already exists');
      }
      return true;
    })
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain a special character'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export async function showSignupForm(req, res) {
  res.render('layout', {
    title: 'Sign up',
    page: 'pages/auth/signup',
    errors: [],
  });
}

export const signup = [
  validateSignup,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.render('layout', {
          title: 'Sign up',
          page: 'pages/auth/signup',
          errors: errors.array(),
        });
      }

      const { confirmPassword, ...userData } = matchedData(req);
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await createUser({ ...userData, password: hashedPassword });
      res.redirect('/auth/login');
    } catch (error) {
      next(error);
    }
  },
];

export async function showLoginForm(req, res) {
  const passportMessages = req.session.messages || [];
  req.session.messages = [];

  const validationErrors = req.session.validationErrors || [];
  req.session.validationErrors = [];

  const error = validationErrors[0]?.msg || passportMessages[0];

  res.render('layout', {
    title: 'Login',
    page: 'pages/auth/login',
    error,
  });
}

export const login = [
  validateLogin,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.validationErrors = errors.array();
      return res.redirect('/auth/login');
    }
    next();
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureMessage: true,
  }),
];

export async function logout(req, res, next) {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/auth/login');
  });
}
