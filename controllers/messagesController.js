import { body, matchedData, validationResult } from 'express-validator';
import { createMessage, deleteMessageById } from '../db/queries.js';

const validateMessages = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Title must be 1-50 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Content must be 1-255 characters'),
];

export async function create(req, res) {
  res.render('layout', {
    title: 'Create New Message',
    page: 'pages/messages/create',
    errors: [],
  });
}

export const store = [
  validateMessages,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('layout', {
        title: 'Create New Message',
        page: 'pages/messages/create',
        errors: errors.array(),
      });
    }

    const { title, content } = matchedData(req);
    const userId = res.locals.currentUser.id;
    await createMessage({ title, content, user_id: userId });
    res.redirect('/');
  },
];

export async function destroy(req, res) {
  const { id } = req.params;
  await deleteMessageById(Number(id));

  res.redirect('/');
}
