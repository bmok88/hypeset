/**
 * Created by chrisng on 3/13/17.
 */
import request from 'request';
import cheerio from 'cheerio';
import moment from 'moment';
import {findBrands, findClass, findTag, formatDate} from '../../utils/scriptHelpers';

const now = moment().subtract(1, 'days').unix();
const xago = moment().subtract(8, 'days').unix();

const initialArticleState = {
  weekendReading: [],
  grailFits: [],
  staffPicks: [],
  news: [],
};

async function parseGrailedArticles(articles = initialArticleState, availableBrands = ['needles'], page = 1, latestArticleDate = xago) {
  return new Promise((resolve) => {
    let continueParsing = true;
    request(`${process.env.GRAILED_URL}/drycleanonly?page=${page}`, (err, res) => {
      const $ = cheerio.load(res.body);
      $('.tertiary-articles-row').each((rowIndex, row) => {
        const article = {};
        article.site = 'grailed';
        article.title = findTag(row, 'h1')[0].children[0].data.trim();
        const date = formatDate(findTag(row, 'h4')[0].children[0].data.trim().split(' '));
        article.date = moment(date, 'MM-DD-YYYY').unix();
        const endpoint = findClass(row, 'tertiary-article')[0].attribs.href;
        article.url = `${process.env.GRAILED_URL}${endpoint}`;
        article.imgUrl = findClass(row, 'hero')[0].attribs.src;
        article.blurb = findClass(row, 'subtitle')[0].children[0].data.trim();

        // separate parsing for weekend reading, the best #grailfits of the week, and staff picks
        const titleWords = article.title.split(' ');
        if (titleWords.length > 1 && titleWords.slice(0, 2).join(' ') === 'Weekend Reading:') {
          articles.weekendReading.push(article);
        } else if (titleWords.length > 5 && titleWords.slice(0, 7).join(' ') === 'The Best #GrailFits Of The Week') {
          articles.grailFits.push(article);
        } else if (titleWords.length > 1 && titleWords.slice(0, 2).join(' ') === 'Staff Picks:') {
          articles.staffPicks.push(article);
        } else {
          const brands = findBrands(article.title, availableBrands);
          if (brands) {
            article.brands = brands;
            moment(latestArticleDate).diff(article.date, 'seconds') < 0 ? articles.news.push(article) : continueParsing = false;
          }
        }
      });
      if (continueParsing) {
        resolve(parseGrailedArticles(articles, availableBrands, page + 1, latestArticleDate));
      }
      resolve(articles);
    });
  });
}

module.exports = { parseGrailedArticles };