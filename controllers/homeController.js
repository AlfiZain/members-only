export async function index(req, res) {
  res.render('layout', {
    title: 'Homepage',
    page: 'pages/home/index',
  });
}
