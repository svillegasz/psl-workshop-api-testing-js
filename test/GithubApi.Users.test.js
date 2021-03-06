const agent = require('superagent-promise')(require('superagent'), Promise);
const responseTime = require('superagent-response-time');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Github Api Test', () => {
  describe('Query params', () => {
    it('Should respond in less than 5 seconds', () =>
      agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .use(responseTime((req, time) => {
          expect(time).to.be.at.most(5000);
        })));

    it('Should return 30 Users by default', () =>
      agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.length).to.equal(30);
        }));

    it('Should return 10 Users', () => {
      const limit = 10;
      return agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query(`per_page=${limit}`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.length).to.equal(limit);
        });
    });

    it('Should return 50 users', () => {
      const limit = 50;
      return agent.get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query(`per_page=${limit}`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.length).to.equal(limit);
        });
    });
  });
});
