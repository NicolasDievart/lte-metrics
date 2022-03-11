import analysis from './../greenit-analysis-cli/commands/analyse.js';

export default async () => {
  return await analysis({
    url_input_file: './urls-greenit.yaml',
    timeout: 180000,
    retry: 2,
    max_tab: 40,
    worst_pages: 5,
    worst_rules: 5,
    device: 'desktop'
  });
};
