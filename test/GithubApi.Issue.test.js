const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'svillegasz';
const repository = 'psl-workshop-api-testing-js';

describe('Github Api Test', () => {
  describe('Issue', () => {
    it('Should have a public repository', () =>
      agent.get(`${urlBase}/user`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.body.public_repos).to.be.at.least(1);
        }));

    it('Via OAuth2 Tokens by parameter', () =>
      agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .query(`access_token=${process.env.ACCESS_TOKEN}`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.description).equal('This is a Workshop about Api Testing in JavaScript');
        }));
  });
});
