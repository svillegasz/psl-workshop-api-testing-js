const fs = require('fs');
const crypto = require('crypto');
const agent = require('superagent-promise')(require('superagent'), Promise);
const subset = require('chai-subset');
const { expect, assert } = require('chai').use(subset);

const urlBase = 'https://api.github.com/users';
const githubUserName = 'aperdomob';

describe('Github API Test', () => {
  describe('GET Service', () => {
    let user;

    before(() =>
      agent.get(`${urlBase}/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((res) => {
          user = res.body;
        }));

    it('Should return the user information', () => {
      expect(user.company).to.equal('PSL');
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.location).to.equal('Colombia');
    });

    describe('Repository', () => {
      let repository;
      let dir;

      before(() =>
        agent.get(user.repos_url)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            repository = response.body.find(repo => repo.name === 'jasmine-awesome-report');
          }));

      before(() => {
        dir = 'temp';
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
      });

      it('Should return the repository information', () => {
        expect(repository.name).to.equal('jasmine-awesome-report');
        expect(repository.description).to.equal('An awesome html report for Jasmine');
        assert.isFalse(repository.private);
      });

      describe('Zip file', () => {
        before(() => {
          const zipFile = fs.createWriteStream(`${dir}/repo.zip`);
          return agent.get(`${repository.url}/zipball/`).pipe(zipFile);
        });

        it('Should save correctly', () => {
          const zipFile = fs.readFileSync(`${dir}/repo.zip`);
          assert.isDefined(zipFile);
        });
      });

      describe('README file', () => {
        let files;

        before(() => {
          const rawUrl = repository.contents_url;
          const url = rawUrl.substr(0, rawUrl.lastIndexOf('/'));
          return agent.get(url)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              files = response.body;
              const readmeFile = fs.createWriteStream(`${dir}/README.md`);
              return agent.get(files.find(file => file.name === 'README.md').download_url).pipe(readmeFile);
            });
        });

        it('Should be defined', () => {
          expect(files).to.containSubset([{
            name: 'README.md',
            path: 'README.md',
            sha: '9bcf2527fd5cd12ce18e457581319a349f9a56f3'
          }]);
        });

        it('Should generate a md5 hash', () => {
          const readmeFile = fs.readFileSync(`${dir}/README.md`);
          const md5Hash = crypto.createHash('md5').update(readmeFile).digest('hex');
          expect(md5Hash).to.equal('d41d8cd98f00b204e9800998ecf8427e');
        });
      });
    });
  });
});
