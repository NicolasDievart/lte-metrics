import yellowlabtools from './yellowlabtools.js';
import lighthouse from './lighthouse.js';
import greenit from './greenit.js';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import Report from './report/report.js';
import WeightByMimeType from './report/weightByMimeType.js';

const URL_YAML_FILE = path.resolve('urls.yaml');

//Get list of url
let urls = [];
let reports = new Map();
try {
  urls = YAML.parse(fs.readFileSync(URL_YAML_FILE).toString());
} catch (error) {
  throw ` urls yaml file : "${URL_YAML_FILE}" is not a valid YAML file.`;
}

let index = 1;
for (let url of urls) {
  reports.set(url, new Report(url, index));
  ++index;
}

function extractLighthouseMetrics() {
  reports.forEach((report) => {
    const reportJson = fs.readFileSync('result/lighthouse-report-' + report.index + '.json');
    const data = JSON.parse(reportJson);
    report.timeToInteractive = data['audits']['first-meaningful-paint']['displayValue'];
    report.firstMeaningfulPaint = data['audits']['interactive']['displayValue'];
  });
}

function extractGreenITMetrics() {
  // Greenit does not use the same index as the yaml file.
  let index = 1;
  for (let url in urls) {
    const reportJson = fs.readFileSync('greenit-analysis/results/' + index + '.json');
    const data = JSON.parse(reportJson);

    let report = reports.get(data['url']);
    report.waterConsumption = data['waterConsumption'];
    report.greenhouseGasesEmission = data['greenhouseGasesEmission'];
    report.ecoIndex = data['ecoIndex'];
    report.greentITGrade = data['grade'];

    ++index;
  }
}

function extractYellowLabToolsMetrics() {
  reports.forEach((report) => {
    const reportJson = fs.readFileSync('result/yellowlabtools-report-' + report.index + '.json');
    const data = JSON.parse(reportJson);

    report.totalRequest = data['rules']['totalRequests']['value'];
    report.totalWeightInBytes = data['rules']['totalWeight']['value'];

    const weightByMimeTypes = data['rules']['totalWeight']['offendersObj']['list']['byType'];
    for (const mimeType in weightByMimeTypes) {
      report.addMimeTypeWeight(
        new WeightByMimeType(mimeType, weightByMimeTypes[mimeType]['totalWeight'])
      );
    }

    report.domElementsCount = data['rules']['DOMelementsCount']['value'];
    report.domElementsCountScore = data['rules']['DOMelementsCount']['score'];
    report.cachingNotSpecified = data['rules']['cachingNotSpecified']['value'];
    report.cachingDisabled = data['rules']['cachingDisabled']['value'];
    report.cachingTooShort = data['rules']['cachingTooShort']['value'];
  });
}

(async () => {
  console.time('metrics');

  try {
    await lighthouse();
  } finally {
    extractLighthouseMetrics();
  }

  try {
    await yellowlabtools();
  } catch (err) {
    console.error(err);
  } finally {
    extractYellowLabToolsMetrics();
  }

  try {
    await greenit();
  } finally {
    extractGreenITMetrics();
  }

  console.timeEnd('metrics');

  // Prepare report.json file indexed by timestamp.
  const timestamp = new Date().getTime();

  let data = {};
  if (fs.existsSync('report.json')) {
    const reportJson = fs.readFileSync('./report.json');
    data = JSON.parse(reportJson);
  }

  let reportAsArray = [];
  reports.forEach((report) => {
    reportAsArray.push(report);
  });

  data[timestamp] = reportAsArray;

  try {
    let a = JSON.stringify(data);

    fs.writeFileSync('./report.json', a, { encoding: 'utf8', flag: 'w' });
  } catch (err) {
    console.error(err);
  }
})();
