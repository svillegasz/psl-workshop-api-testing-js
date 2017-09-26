const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect, assert } = require('chai');

const urlBase = 'https://api.github.com';

describe('Github Api Test', () => {
  describe('POST/PATCH Service', () => {
    let user;

    before(() => agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        user = response.body;
      }));

    it('Should have a public repository', () => {
      expect(user.public_repos).to.be.at.least(1);
    });

    describe('Repository', () => {
      let repository;
      before(() =>
        agent.get(user.repos_url)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            repository = response.body.find(repo => repo.name === 'frisby-tutorial');
          }));

      it('Should be valid', () => {
        assert.isOk(repository);
      });

      describe('Issue', () => {
        let issue;

        before(() =>
          agent
            .post(`${repository.url}/issues`)
            .auth('token', process.env.ACCESS_TOKEN)
            .send({
              title: 'Testing the Issue creation!'
            })
            .then((response) => {
              issue = response.body;
            }));

        it('Should create an Issue', () => {
          expect(issue.title).to.equal('Testing the Issue creation!');
        });

        it('Should update an Issue', () =>
          agent
            .patch(issue.url)
            .auth('token', process.env.ACCESS_TOKEN)
            .send({
              body: 'This is an awesome issue!'
            })
            .then((response) => {
              expect(response.body.title).to.equal('Testing the Issue creation!');
              expect(response.body.body).to.equal('This is an awesome issue!');
            }));
      });
    });
  });
});
