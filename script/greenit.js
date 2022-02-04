import analysis from './../greenit-analysis/commands/analyse.js';
import headers from './../auth_header.json';

export default async () => {
  return await analysis({
    yaml_input_file: 'urls.yaml',
    timeout: 180000,
    retry: 2,
    max_tab: 40,
    worst_pages: 5,
    worst_rules: 5,
    device: 'desktop',
    headers: headers
  });
};
