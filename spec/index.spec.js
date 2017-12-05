process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const { expect } = require('chai');
const saveTestData = require('../seed/test.seed');


describe('API', () => {
  let userData;
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then((data) => {
        userData = data;
      })
      .catch((err) => console.log('error', err));
  });
  describe('GET /api', () => {
    it('returns response with 200 status code', () => {
      return request
        .get('/api/')
        .expect(200)
        .then(res => {
          expect(res.body).to.eql({ status: 'api route' });
        });
    });
  });
  describe('GET api/topics', () => {
    it('responds the correct object with a status code of 200', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics.length).to.equal(3);
          expect(res.body.topics[0].title).to.be.a('string');
        });
    });
  });
  describe('GET api/topics/:topic_id/articles', () => {
    it('responds the correct object with a status code of 200', () => {
      return request 
        .get('/api/topics/football/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(1);
          expect(res.body.articles[0].belongs_to).to.equal('football');
        });
    });
  });

});