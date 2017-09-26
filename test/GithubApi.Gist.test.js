const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Github Api Test', () => {
  describe('Gists', () => {
    let response;
    let issue;

    const body = {
      description: 'the description for this gist',
      public: true,
      files: {
        'file1.txt': {
          content: 'String file contents'
        }
      }
    };

    before(() =>
      agent.post(`${urlBase}/gists`)
        .auth('token', process.env.ACCESS_TOKEN)
        .send(body)
        .then((res) => {
          response = res;
          issue = res.body;
        }));

    it('Should be created', () => {
      expect(response.status).to.equal(statusCode.CREATED);
      expect(issue).to.containSubset(body);
    });

    it('Should exists', () =>
      agent.get(issue.url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((res) => {
          expect(res.status).to.equal(statusCode.OK);
        }));

    describe('On delete', () => {
      before(() =>
        agent.del(issue.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((res) => {
            response = res;
          }));

      it('Should be deleted', () => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
      });

      it('Should NOT exists', () =>
        agent.get(issue.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .catch((res) => {
            expect(res.response.status).to.equal(statusCode.NOT_FOUND);
          }));
    });
  });
});
