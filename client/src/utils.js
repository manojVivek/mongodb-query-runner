import path from 'path';
import querystring from 'querystring';

export function url(urlPath, queryParams) {
  const urlPrefix = isDev()
    ? 'http://127.0.0.1:3001/mongoDBQueryRunner/'
    : '/mongoDBQueryRunner';
  return path.join(
    urlPrefix,
    urlPath,
    queryParams ? '?' + querystring(queryParams) : ''
  );
}

export function processResponse(response) {
  if (!response.ok) {
    return response.text().then(text => {throw 'Error:' + text});
  }
  return response.json();
};

export function isDev() {
  return process.NODE_ENV === 'production';
}
