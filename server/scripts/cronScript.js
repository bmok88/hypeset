/**
 * Created by chrisng on 3/16/17.
 */
import cron from 'cron';
import { retrieveBrands } from './brands/retrieveBrands';
import { retrieveNews } from './news/retrieveNews';

export default function runScripts() {
  const CronJob = cron.CronJob;
  const job = new CronJob('* * 01 * * *', onStart, null, true, 'America/Los_Angeles');
  console.log('Starting..');
  job.start();
};

async function onStart() {
  console.log('Started web scraping scripts..');
  await retrieveBrands();
  await retrieveNews();
  console.log('Done with web scraping scripts..')
}

runScripts();