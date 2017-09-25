const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

const urlBase = 'https://github.com';
const githubUserName = 'aperdomob';

describe.only('Github Api Test', () => {
  describe('HEAD Service', () => {
    let res;

    before(() =>
      agent.head(`${urlBase}/${githubUserName}/redirect-test`)
        .catch((response) => {
          res = response.response;
        }));

    it('Should respond with a redirect', () => {
      expect(res.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(res.headers.location).to.equal('https://github.com/aperdomob/new-redirect-test');
    });
  });
});
