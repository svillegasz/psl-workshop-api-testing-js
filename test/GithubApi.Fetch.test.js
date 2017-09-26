require('isomorphic-fetch');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe.only('Github Api Test', () => {
  describe('Gists', () => {
    let resStatus;
    let gist;

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
      fetch(`${urlBase}/gists`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      }).then((res) => {
        resStatus = res.status;
        return res.json();
      })
        .then((json) => {
          gist = json;
        }));

    it('Should be created', () => {
      expect(resStatus).to.equal(statusCode.CREATED);
      expect(gist).to.containSubset(body);
    });

    it('Should exists', () =>
      fetch(gist.url, {
        method: 'GET',
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      }).then((res) => {
        expect(res.status).to.equal(statusCode.OK);
      }));

    describe('On delete', () => {
      before(() =>
        fetch(gist.url, {
          method: 'DELETE',
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        }).then((res) => {
          resStatus = res.status;
        }));

      it('Should be deleted', () => {
        expect(resStatus).to.equal(statusCode.NO_CONTENT);
      });

      it('Should NOT exists', () =>
        fetch(gist.url, {
          method: 'GET',
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        }).then((res) => {
          expect(res.status).to.equal(statusCode.NOT_FOUND);
        }));
    });
  });
});
