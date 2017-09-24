const fs = require('fs');
const agent = require('superagent-promise')(require('superagent'), Promise);
const subset = require('chai-subset');
const { expect, assert } = require('chai').use(subset);

const urlBase = 'https://api.github.com/users';
const githubUserName = 'aperdomob';

describe('Github API Test', () => {
  describe('GET Service', () => {
    let user;

    before(() =>
      agent.get(`${urlBase}/${githubUserName}`).then((res) => {
        user = res.body;
      }));

    it('Should return the user information', () => {
      expect(user.company).to.equal('PSL');
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.location).to.equal('Colombia');
    });

    describe('Repository', () => {
      let repository;

      before(() =>
        agent.get(user.repos_url).then((response) => {
          repository = response.body.find(repo => repo.name === 'jasmine-awesome-report');
        }));

      it('Should return the repository information', () => {
        expect(repository.name).to.equal('jasmine-awesome-report');
        expect(repository.description).to.equal('An awesome html report for Jasmine');
        assert.isFalse(repository.private);
      });

      describe('Zip file', () => {
        before(() => {
          const zipFile = fs.createWriteStream('repo.zip');
          return agent.get(`${repository.url}/zipball/`).pipe(zipFile);
        });

        it('Should save correctly', () => {
          const zipFile = fs.readFileSync('repo.zip');
          assert.isDefined(zipFile);
        });
      });

      describe('README file', () => {
        it('Should be defined', () => {
          const rawUrl = repository.contents_url;
          const url = rawUrl.substr(0, rawUrl.lastIndexOf('\\'));
          agent.get(url).then((response) => {
            expect(response.body).to.containSubset({
              name: 'README.md',
              path: 'README.md',
              sha: '9bcf2527fd5cd12ce18e457581319a349f9a56f3'
            });
          });
        });
      });
    });
  });
});
