import lighthouse from 'lighthouse';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import chromeLauncher from 'chrome-launcher';

export default async () => {
  const URL_YAML_FILE = path.resolve('urls.yaml');
  //Get list of url
  let urls = [];
  try {
    urls = yaml.parse(fs.readFileSync(URL_YAML_FILE).toString());
  } catch (error) {
    throw ` yaml_input_file : "${URL_YAML_FILE}" is not a valid YAML file.`;
  }

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyAudits: ['first-meaningful-paint', 'speed-index', 'first-cpu-idle', 'interactive'],
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
