import lighthouse from './lighthouse.js';
import greenit from './greenit.js';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import Report from './../report/report.js';
import WeightByMimeType from './../report/weightByMimeType.js';

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
    report.firstMeaningfulPaint = parseMilliseconds(
      data['audits']['first-meaningful-paint']['numericValue']
    );
    report.timeToInteractive = parseMilliseconds(data['audits']['interactive']['numericValue']);
    report.domElementsCount = data['audits']['dom-size']['numericValue'];
    report.domElementsCountScore = data['audits']['dom-size']['score'] * 100;

    report.totalRequest = data['audits']['network-requests']['details']['items'].length;

    let totalWeightInBytes = 0;
    const excludedResourceType = ['Preflight'];
    const resourceTypeMapping = {
      Font: 'webfont',
      Document: 'html',
      Image: 'image',
      Media: 'media',
      Stylesheet: 'css',
      Script: 'js',
      Fetch: 'json'
    };

    let weightByMimeTypes = {
      webfont: 0,
      media: 0,
      html: 0,
      image: 0,
      css: 0,
      js: 0,
      json: 0,
      other: 0
    };

    for (const request of data['audits']['network-requests']['details']['items']) {
      if (excludedResourceType.includes(request.resourceType)) {
        continue;
      }

      let resourceType = resourceTypeMapping[request.resourceType];
      if (typeof resourceType === 'undefined') {
        resourceType = 'other';
      }
      weightByMimeTypes[resourceType] = weightByMimeTypes[resourceType] + request.transferSize;
    }

    for (const mimeType in weightByMimeTypes) {
      totalWeightInBytes += weightByMimeTypes[mimeType];
      report.addMimeTypeWeight(new WeightByMimeType(mimeType, weightByMimeTypes[mimeType]));
    }
    report.totalWeightInBytes = totalWeightInBytes;
  });
}

function parseMilliseconds(number) {
  return parseFloat(((number % 60000) / 1000).toFixed(2));
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

(async () => {
  console.time('metrics');

  try {
    await lighthouse();
  } finally {
    extractLighthouseMetrics();
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
