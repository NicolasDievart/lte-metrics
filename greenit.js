const analysis = require('./greenit-analysis/commands/analyse');
const path = require('path');

module.exports = async () => {
  await analysis({
    yaml_input_file: 'urls.yaml',
    timeout: 180000,
    retry: 2,
    max_tab: 40,
    worst_pages: 5,
    worst_rules: 5,
    device: 'desktop'
  });
};
