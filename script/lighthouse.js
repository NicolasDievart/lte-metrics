import lighthouse from 'lighthouse';
import fs from 'fs';
import chromeLauncher from 'chrome-launcher';
import urlsFile from './../urls.json' assert { type: 'json' };
import headers from './../auth_header.json' assert { type: 'json' };

export default async () => {
  //Get list of url
  let urls = urlsFile.urls;

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '', '--']
  });
  const options = {
    disableStorageReset: true,
    flags: {
      extraHeaders: headers
    },
    logLevel: 'info',
    output: 'json',
    port: chrome.port
  };

  let index = 1;

  for (const url of urls) {
    console.log('Lighthouse : Analysis of ' + url);
    const runnerResult = await lighthouse(url, options);

    // `.report` is the json report as a string
    const reportJson = runnerResult.report;
    fs.writeFileSync('result/lighthouse-report-' + index + '.json', reportJson);

    // `.lhr` is the Lighthouse Result as a JS object
    console.log('Report is done for', runnerResult.lhr.finalUrl);
    console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
    ++index;
  }

  await chrome.kill();

  return index;
};
