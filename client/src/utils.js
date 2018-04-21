import _url from 'url';
import path from 'path';
import querystring from 'querystring';

export function url(urlPath, queryParams) {
  const urlPrefix = isDev()
    ? 'http://127.0.0.1:3001/mongoDBQueryRunner/rest'
    : 'http://127.0.0.1:3001/mongoDBQueryRunner/rest';
    //TODO Fix this properly
    if (urlPath[0] != '/') {
      urlPath = '/' + urlPath;
    }
  const url = path.join(urlPath, queryParams ? '?' + querystring.stringify(queryParams) : '');
  return urlPrefix + url;
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
