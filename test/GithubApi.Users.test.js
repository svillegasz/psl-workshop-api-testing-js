const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe.only('Github Api Test', () => {
  describe('Users', () => {
    it('Should return a no-content status', () =>
      agent.get(`${urlBase}/users`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.length).to.equal(30);
        }));

    it('Should return a no-content status', () => {
      const limit = 10;
      return agent.get(`${urlBase}/users`)
        .query(`per_page=${limit}`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.length).to.equal(limit);
        });
    });

    it('Should return a no-content status', () => {
      const limit = 50;
      return agent.get(`${urlBase}/users`)
        .query(`per_page=${limit}`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.length).to.equal(limit);
        });
    });
  });
});
