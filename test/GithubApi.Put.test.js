const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

const urlBase = 'https://api.github.com/user/following';
const githubUserName = 'aperdomob';

describe('Github Api Test', () => {
  describe('PUT Service', () => {
    it('Should return a no-content status', () =>
      agent.put(`${urlBase}/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.equal(statusCode.NO_CONTENT);
          assert.isEmpty(response.body);
        }));

    it('Should follow the github user', () =>
      agent.get(`${urlBase}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          const user = response.body.find(usr => usr.login === githubUserName);
          assert.exists(user);
          expect(user.login).to.equal(githubUserName);
        }));

    it('Should be idempotent', () =>
      agent.put(`${urlBase}/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.equal(statusCode.NO_CONTENT);
          assert.isEmpty(response.body);
        }));
  });
});
