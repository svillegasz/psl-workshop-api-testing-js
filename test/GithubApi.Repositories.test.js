const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');

describe('Github API: repositories tests', () => {
  const endpoint = 'https://api.github.com/users/aperdomob';
  let user;

  before(() =>
    agent.get(endpoint).then((res) => {
      user = res.body;
    }));

  it('Should return the user information', () => {
    expect(user.company).to.equal('PSL');
    expect(user.name).to.equal('Alejandro Perdomo');
    expect(user.location).to.equal('Colombia');
  });

  it('Should return the repository information', () =>
    agent.get(user.repos_url).then((response) => {
      const repository = response.body.find(repo => repo.name === 'jasmine-awesome-report');
      expect(repository.name).to.equal('jasmine-awesome-report');
      expect(repository.description).to.equal('An awesome html report for Jasmine');
      expect(repository.private).to.be.false;
    }));
});

