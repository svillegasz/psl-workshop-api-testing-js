const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Github Api Test', () => {
  describe('PUT Service', () => {
    let response;

    before(() =>
      agent.put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((res) => {
          response = res;
        }));

    it('Should return a no-content status', () => {
      expect(response.status).to.equal(statusCode.NO_CONTENT);
      assert.isEmpty(response.body);
    });

    it('Should follow the github user', () =>
      agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((res) => {
          const user = res.body.find(usr => usr.login === githubUserName);
          assert.exists(user);
          expect(user.login).to.equal(githubUserName);
        }));

    describe('Idempotency', () => {

      before(() =>
        agent.put(`${urlBase}/user/following/${githubUserName}`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((res) => {
            response = res;
          }));

      it('Should return a no-content status', () => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
        assert.isEmpty(response.body);
      });

      it('Should follow the github user', () =>
        agent.get(`${urlBase}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((res) => {
            const user = res.body.find(usr => usr.login === githubUserName);
            assert.exists(user);
            expect(user.login).to.equal(githubUserName);
          }));
    });
  });
});
