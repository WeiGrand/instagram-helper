/**
 * Created by heweiguang on 2019-02-23.
 */

const request = require('request');
const requestPromise = require('request-promise');
const prompts = require('prompts');
const fs = require('fs');
const path = require('path');
const {
  BASE,
  USER_AGENT,
  PAGINATION_QUERY_HASH,
  MEDIA_QUERY_HASH
} = require('./constants');
let {
  username,
  password
} = require('../account');
const { md5 } = require('./signature');

class Instagram {
  constructor (props) {
    const { Cookie, interval } = props;

    this.cookie = new Cookie();
    this.pageInitialData = {};
    this.pagePaginationInfo = {};
    this.pageCount = 1;
    this.interval = interval || 3;
  }

  async initialize () {
    console.log('Initializing helper...');

    try {
      const response = await requestPromise({
        url: BASE,
        resolveWithFullResponse: true
      });

      this.cookie.set(response['headers']['set-cookie']);
    } catch (e) {
      console.log(e);
    }
  }

  async login () {
    if (!username || !password) {
      const account = await prompts([
        {
          type: 'text',
          name: 'username',
          message: 'What\'s your Instagram username?',
        },
        {
          type: 'password',
          name: 'password',
          message: 'What\'s your Instagram password?',
        }
      ]);

      username = account['username'];
      password = account['password'];
    }

    const csrfToken = this.cookie.get('.instagram.com')['csrftoken'];

    try {
      const response = await requestPromise.post({
        url: 'https://www.instagram.com/accounts/login/ajax/',
        headers: {
          'User-Agent': USER_AGENT,
          'x-csrftoken': csrfToken,
          'Content-Type' : 'application/x-www-form-urlencoded',
        },
        form: {
          username,
          password,
        },
        resolveWithFullResponse: true
      });

      const { headers, body } = response;

      const parseBody = JSON.parse(body);
      const isLoginSuccess = parseBody['authenticated'];

      if (isLoginSuccess) this.cookie.set(headers['set-cookie']);

      return {
        status: isLoginSuccess,
        data: body
      }
    } catch (e) {
      return e;
    }
  }

  static async _getPageInitialData (url) {
    try {
      const html = await requestPromise({
        url
      });

      const matched = html.match(/window\._sharedData =(.*)(?=;<\/)/mg); // hehe

      if (matched) {
        return JSON.parse(matched[0].split(' = ')[1]);
      }

      return {};
    } catch (e) {
      throw e;
    }
  }

  async _fetchPaginationQuery (userId, after) {
    const variables = JSON.stringify({
      id: userId,
      first: 12,
      after
    });

    const url = BASE + `graphql/query/?query_hash=${PAGINATION_QUERY_HASH}&variables=${variables}`;

    try {
      return await requestPromise({
        url,
        headers: {
          "X-Instagram-GIS": md5(this.pageInitialData['rhx_gis'] + ':' + variables)
        },
        json: true
      });
    } catch (e) {
      throw e;
    }
  }

  async _startScrapeUser (userId, after) {
    console.log('Scrapping page ' + this.pageCount++);

    try {
      const response = await this._fetchPaginationQuery(userId, after);

      const {
        data: {
          user: {
            edge_owner_to_timeline_media: {
              page_info,
              edges,
            }
          }
        }
      } = response;

      this.pagePaginationInfo = page_info;

      if (!fs.existsSync(userId)) {
        fs.mkdirSync(userId);
      }

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];

        const { shortcode } = edge['node'];

        try {
          let medias = await this._fetchMedias({
            shortcode
          });

          if (!medias) return;

          if (!Array.isArray(medias)) medias = [{
            node: medias
          }];

          if (medias && medias.length) {
            for (let j = 0; j < medias.length; j++) {

              const { node } = medias[j];
              const { display_url, is_video, video_url, id } = node;
              const ext = is_video ? 'mp4' : 'jpg';
              const url = is_video ? video_url : display_url;

              console.log('Downloading ' + url);

              const writeFilePromise = new Promise((resolve, reject) => {
                const file = fs.createWriteStream(path.join(userId, id + '.' + ext));

                const req = request.get(url);

                req.on('response', (response) => {
                  if (response.statusCode !== 200) return;

                  req.pipe(file);
                });

                file.on('finish', () => {

                  file.close();

                  resolve();
                });

                file.on('error', e => {
                  reject(e);
                })
              });

              try {
                await writeFilePromise;
                console.log('Waiting ' + this.interval + ' seconds to start next fetch otherwise Instagram will limit the request rate...');
                await this.wait(this.interval);
              } catch (e) {
                throw e;
              }
            }
          }
        } catch (e) {
          if (/socket hang up/.test(e.message)) { // 重试 可以大大提高成功率
            console.log(e);
            i--;
          } else {
            throw e;
          }
        }
      }

      if (this.pagePaginationInfo['has_next_page']) {
        return await this._startScrapeUser(userId, this.pagePaginationInfo['end_cursor']);
      }
    } catch (e) {
      throw e;
    }
  }

  wait (second) {
    return new Promise(resolve => {
      setTimeout(resolve, second * 1000);
    });
  }

  async _fetchMedias (variables) {
    variables = JSON.stringify(variables);

    const url = BASE + `graphql/query/?query_hash=${MEDIA_QUERY_HASH}&variables=${variables}`;

    try {
      const response = await requestPromise({
        url,
        headers: {
          "X-Instagram-GIS": md5(this.pageInitialData['rhx_gis'] + ':' + variables),
        },
        json: true
      });

      const { shortcode_media } = response['data'];

      if (shortcode_media['edge_sidecar_to_children']) {
        return shortcode_media['edge_sidecar_to_children']['edges'];
      }

      return shortcode_media;
    } catch (e) {
      throw e;
    }
  }

  async scrapeUser () {
    const input = await prompts({
      type: 'text',
      name: 'target',
      message: 'Which user\'s homepage you want to scrape?',
    });

    if (!input['target']) return;

    console.log('Just go!');

    try {
      this.pageInitialData = await Instagram._getPageInitialData(input['target']);

      const userId = this.pageInitialData['entry_data']['ProfilePage'][0]['graphql']['user']['id'];

      console.log('Start scrapping...');

      try {
        await this._startScrapeUser(userId);

        return userId;
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Instagram;
