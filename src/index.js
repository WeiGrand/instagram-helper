/**
 * Created by heweiguang on 2019-02-23.
 */

const Instagram = require('./instagram');
const Cookie = require('./cookie');

const instagram = new Instagram({
  Cookie,
});

module.exports = instagram;
