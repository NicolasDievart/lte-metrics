const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const puppeteer = require('puppeteer');
const createJsonReports = require('../cli-core/analyis.js').createJsonReports;
const create_global_report = require('../cli-core/report.js').create_global_report;

//launch core
async function analyse_core(options) {
    const URL_YAML_FILE = path.resolve(options.yaml_input_file);
    //Get list of url
    let urlTable;
    try {
        urlTable = YAML.parse(fs.readFileSync(URL_YAML_FILE).toString());
    } catch (error) {
        throw ` yaml_input_file : "${URL_YAML_FILE}" is not a valid YAML file.`
    }

    //start browser
    const browser = await puppeteer.launch({
        headless:true,
        args :[
            "--no-sandbox",                 // can't run inside docker without
            "--disable-setuid-sandbox"      // but security issues
        ],
        // Keep gpu horsepower in headless
        ignoreDefaultArgs:[
            '--disable-gpu'
        ]
    });
    //handle analyse
    let reports;
    try {
        //analyse
        reports = await createJsonReports(browser, urlTable, options);
    } finally {
        //close browser
        let pages = await browser.pages();
        await Promise.all(pages.map(page =>page.close()));
        await browser.close()
    }

    //create report
    await create_global_report(reports, options);
}

//export method that handle error
async function analyse(options) {
    await analyse_core(options).catch(e=>console.error("ERROR : \n" + e))
}

module.exports = analyse;
