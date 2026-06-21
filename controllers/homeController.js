import { getHomepageData } from '../db/queries.js';

export async function index(req, res) {
  const messagesData = await getHomepageData();

  res.render('layout', {
    title: 'Homepage',
    page: 'pages/home/index',
    messages: messagesData,
  });
}
