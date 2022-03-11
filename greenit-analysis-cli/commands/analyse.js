const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const puppeteer = require('puppeteer');
const createJsonReports = require('../cli-core/analysis.js').createJsonReports;
const create_global_report = require('../cli-core/reportGlobal.js').create_global_report;

//launch core
async function analyse_core(options) {
  const URL_YAML_FILE = path.resolve(options.url_input_file);
  //Get list of pages to analyze and its informations
  let pagesInformations;
  try {
    pagesInformations = YAML.parse(fs.readFileSync(URL_YAML_FILE).toString());
  } catch (error) {
    throw ` url_input_file : "${URL_YAML_FILE}" is not a valid YAML file.`;
  }

  let browserArgs = [
    '--no-sandbox', // can't run inside docker without
    '--disable-setuid-sandbox' // but security issues
  ];

  // Add proxy conf in browserArgs
  let proxy = {};

  // Read headers http file
  let headers;
  if (options.headers) {
    headers = readHeaders(options.headers);
  }

  //start browser
  const browser = await puppeteer.launch({
    headless: true,
    args: browserArgs,
    // Keep gpu horsepower in headless
    ignoreDefaultArgs: ['--disable-gpu']
  });
  //handle analyse
  let reports;
  try {
    //analyse
    reports = await createJsonReports(browser, pagesInformations, options, proxy, headers);
  } finally {
    //close browser
    let pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    await browser.close();
  }
  //create report
  await create_global_report(reports, options);
}

function readHeaders(headersFile) {
  const HEADERS_YAML_FILE = path.resolve(headersFile);
  let headers;
  try {
    headers = YAML.parse(fs.readFileSync(HEADERS_YAML_FILE).toString());
  } catch (error) {
    throw ` --headers : "${HEADERS_YAML_FILE}" is not a valid YAML file.`;
  }
  return headers;
}

//export method that handle error
async function analyse(options) {
  await analyse_core(options).catch((e) => console.error('ERROR : \n', e));
}

module.exports = analyse;
