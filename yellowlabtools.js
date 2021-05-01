import yellowlabtools from 'yellowlabtools';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export default async () => {
  const URL_YAML_FILE = path.resolve('urls.yaml');

  //Get list of url
  let urls = [];
  try {
    urls = yaml.parse(fs.readFileSync(URL_YAML_FILE).toString());
  } catch (error) {
    throw ` urls yaml file : "${URL_YAML_FILE}" is not a valid YAML file.`;
  }

  let index = 1;
  for (let url of urls) {
    console.log('YellowLabTools : Analysis of ' + url);

    let data = await yellowlabtools(url, {});
    delete data.toolsResults;
    delete data.javascriptExecutionTree;
    fs.writeFileSync(
      'result/yellowlabtools-report-' + index + '.json',
      JSON.stringify(data, null, 2)
    );

    ++index;
  }
};
