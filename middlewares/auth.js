export function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/');
}

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/auth/login');
}

export function ensureMember(req, res, next) {
  if (req.isAuthenticated() && res.locals.currentUser.membership_status) {
    return next();
  }

  return res.redirect('/');
}

export function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && res.locals.currentUser.is_admin) {
    return next();
  }

  return res.redirect('/');
}
