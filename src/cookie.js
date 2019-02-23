/**
 * Created by heweiguang on 2019-02-21.
 */

const { NOT_COOKIE_VALUE } = require('./constants');

class Cookie {
  constructor () {
    this.cookies = {};
  }

  get (domain, stringify) {
    const domainCookies = this.cookies[domain];

    if (!domainCookies) {
      return stringify ? '' : {};
    }

    if (!stringify) {
      return domainCookies;
    }

    return Object.keys(domainCookies).map(key => {
      return `${key}=${domainCookies[key]}`;
    }).join('; ');
  }

  _set (domain, key, value) {
    if (!this.cookies[domain]) {
      this.cookies[domain] = {};
    }

    this.cookies[domain][key] = value;
  }

  set (setCookieArray) {
    setCookieArray.forEach(cookieString => {
      let domain = '';
      let key = '';
      let value = '';

      cookieString.split('; ').forEach(field => {
        const [k, v] = field.split('=');

        if (!v) return;

        if (NOT_COOKIE_VALUE.indexOf(k) === -1) {
          key = k;
          value = v;
        }

        if (k === 'Domain') {
          domain = v;
        }
      });

      if (domain) {
        this._set(domain, key, value);
      }
    });
  }
}

module.exports = Cookie;
