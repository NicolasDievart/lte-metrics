import lighthouse from 'lighthouse';
import fs from 'fs';
import chromeLauncher from 'chrome-launcher';
import urlsFile from './../urls.json' assert { type: 'json' };
import headers from './../auth_header.json' assert { type: 'json' };

export default async () => {
  //Get list of url
  let urls = urlsFile.urls;

  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless',
      '--local-storage="{"utilisateur_connecte":{"ademe_user_id":"782e6dce-b2df-4ae2-a515-21667fb0c1c5","access_token":"eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3NjcwNWEzMy02YmVmLTQxMWItOGZlNS0zZDQzOWY4MzM2ZjkifQ.eyJleHAiOjE2MzI0Nzc3MTUsImlhdCI6MTYzMjQ3NDExNSwiYXV0aF90aW1lIjoxNjMyNDc0MTE1LCJqdGkiOiJmZTY4YThjNC1iZDRlLTRhNjQtOWIxMy1jMzBkYjM3N2JjNmQiLCJpc3MiOiJodHRwczovL21vbmNvbXB0ZS5hZGVtZS5mci9hdXRoL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiNzgyZTZkY2UtYjJkZi00YWUyLWE1MTUtMjE2NjdmYjBjMWM1IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidGVycml0b2lyZXNlbnRyYW5zaXRpb25zIiwic2Vzc2lvbl9zdGF0ZSI6ImNhZmYzYTJlLTY3NDktNDc3NC1iY2UwLTljYTA2YjYxNzJhZSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJvZmZsaW5lX2FjY2VzcyIsImV4dGVybmFsX3VzZXIiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InRlcnJpdG9pcmVzZW50cmFuc2l0aW9ucyI6eyJyb2xlcyI6WyJjb25zZW50Q0dVIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJzaWQiOiJjYWZmM2EyZS02NzQ5LTQ3NzQtYmNlMC05Y2EwNmI2MTcyYWUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Ik5pY29sYXMgRGlldmFydCIsInByZWZlcnJlZF91c2VybmFtZSI6Im5pY29sYXMuZGlldmFydEBmYWlybmVzcy5jb29wIiwibG9jYWxlIjoiZnIiLCJnaXZlbl9uYW1lIjoiTmljb2xhcyIsImZhbWlseV9uYW1lIjoiRGlldmFydCIsImVtYWlsIjoibmljb2xhcy5kaWV2YXJ0QGZhaXJuZXNzLmNvb3AifQ.Zgw9tNAw1845FMIN7JevfnwBbTmnftL1xPitYyGtHpQ","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3NjcwNWEzMy02YmVmLTQxMWItOGZlNS0zZDQzOWY4MzM2ZjkifQ.eyJleHAiOjE2MzI0Nzc3MTUsImlhdCI6MTYzMjQ3NDExNSwianRpIjoiOWU5Y2ViYzYtYzYyYS00MDEwLTk3MzAtMzE3MjAzODIxYTc2IiwiaXNzIjoiaHR0cHM6Ly9tb25jb21wdGUuYWRlbWUuZnIvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiaHR0cHM6Ly9tb25jb21wdGUuYWRlbWUuZnIvYXV0aC9yZWFsbXMvbWFzdGVyIiwic3ViIjoiNzgyZTZkY2UtYjJkZi00YWUyLWE1MTUtMjE2NjdmYjBjMWM1IiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InRlcnJpdG9pcmVzZW50cmFuc2l0aW9ucyIsInNlc3Npb25fc3RhdGUiOiJjYWZmM2EyZS02NzQ5LTQ3NzQtYmNlMC05Y2EwNmI2MTcyYWUiLCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJzaWQiOiJjYWZmM2EyZS02NzQ5LTQ3NzQtYmNlMC05Y2EwNmI2MTcyYWUifQ.zOwfcJokiazitktgQeM5pJMKpncmE5n1qHkGzBAWGV4","email":"","nom":"","prenom":""}}"',
      '--'
    ]
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
