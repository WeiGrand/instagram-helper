/**
 * Created by heweiguang on 2019-02-23.
 */

const instagram = require('../src');

function run () {
  switch (process.env.TASK) {
    case 'LOGIN':
      instagram.login()
      .then(response => {
        const { status, data } = response;

        if (!status) {
          console.log('Login failed. Please check your `username` or `password` and retry');
        }

        console.log('Login successfully with response: ' + JSON.stringify(data));
      })
      .catch(e => console.log(e));
      break;
    case 'SCRAPE_USER':
      instagram.scrapeUser().then(userId => {
        console.log('Finish!');
        console.log('type `open ' + userId + '` to see the files');
      }).
        catch(e => console.log(e));
      break;
    default:
      console.log('No task detected');
  }
}

instagram.initialize().then(() => {
  console.log('Instagram helper initialized');
  console.log('Now begin to do the task: ' + process.env.TASK);
  console.log('\n');

  run();
}).catch(e => {
  console.log('Instagram helper fails to initialize with error: ' + e);
});
