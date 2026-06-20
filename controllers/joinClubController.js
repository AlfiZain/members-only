import { promoteToAdmin, promoteToMember } from '../db/queries.js';

export async function index(req, res) {
  res.render('layout', {
    title: 'Join Club',
    page: 'pages/join-club/index',
  });
}

export async function verifyCode(req, res) {
  const { code } = req.body;
  const currentUser = res.locals.currentUser;

  if (code === process.env.ADMIN_CODE) {
    if (currentUser.is_admin) {
      return res.render('layout', {
        title: 'Join Club',
        page: 'pages/join-club/index',
        error: "You're admin already!",
      });
    }

    await promoteToAdmin(currentUser.id);
    return res.redirect('/');
  }

  if (code === process.env.MEMBERSHIP_CODE) {
    if (currentUser.membership_status) {
      return res.render('layout', {
        title: 'Join Club',
        page: 'pages/join-club/index',
        error: "You're member already!",
      });
    }

    await promoteToMember(currentUser.id);
    return res.redirect('/');
  }

  res.render('layout', {
    title: 'Join Club',
    page: 'pages/join-club/index',
    error: 'Invalid secret code',
  });
}
