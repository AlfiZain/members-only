export function notFound(req, res) {
  res.status(404).render('layout', {
    title: '404 - Page Not Found',
    page: 'pages/404',
  });
}
