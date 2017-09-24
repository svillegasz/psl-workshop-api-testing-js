const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('Github repositories API Tests', () => {

  describe('Consume GET service', function() {
    it('Should return the user information on GET request', () => 
      agent.get('https://api.github.com/users/aperdomob').then((response) => {
        expect(response.status).to.equal(statusCode.OK);
        expect(response.body.company).to.equal('PSL');
        expect(response.body.name).to.equal('Alejandro Perdomo');
        expect(response.body.location).to.equal('Colombia');
      })
      );
  });
});
