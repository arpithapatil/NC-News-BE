process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const { expect } = require('chai');
const saveTestData = require('../seed/test.seed');


describe('API', () => {
  let usefulData;
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(saveTestData)
      .then((data) => {
        usefulData = data;
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
          expect(res.body.topics[0].slug).to.be.a('string');
        });
    });
  });
  describe('GET api/topics/:topic_id/articles', () => {
    it('responds the correct object with a status code of 200', () => {
      return request 
        .get(`/api/topics/${usefulData.articles[0].belongs_to}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(1);
          expect(res.body.articles[0].belongs_to).to.equal('cats');
        });
    });
    it('responds with a 404 response for an incorrect topic_id', () => {
      return request
        .get('/api/topics/candycrush/articles')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('page not found');
        });
    });
  });

  describe('GET /api/articles', () => {
    it('sends back the correct object with a status code of 200', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].title).to.be.a('string');
        });
    });
  });

  describe('GET /api/articles/:article_id/comments', () => {
    it('sends back the correct object with a status code of 200', () => {
      return request
        .get(`/api/articles/${usefulData.articles[0]._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.be.an('array');
          expect(res.body.comments.length).to.equal(2);
          expect(res.body.comments[0].body).to.be.a('string');
        });
    });
    it('sends back a 404 response for an incorrect article_id', () => {
      return request
        .get('/api/articles/6345/comments')
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal('page not found');
        });
    });
  });

  describe('POST /api/articles/:article_id/comments', () => {
    it('saves a new comment to the article with a status code of 201', () => {
      return request
        .post(`/api/articles/${usefulData.comments[0].belongs_to}/comments`)
        .send({ body: 'This is my first comment', belongs_to: `${usefulData.comments[0].belongs_to}`, created_by: 'northcoders' })
        .expect(201)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(3);
          expect(res.body[2].body).to.be.a('string');
          expect(res.body[2].body).to.equal('This is my first comment');
        });
    }); 
    it('sends back a 400 response for a bad request', () => {
      return request
        .post('/api/articles/6345/comments')
        .send({ body: 'This is my first comment', belongs_to: `${usefulData.comments[0].belongs_to}`, created_by: 'northcoders' })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('bad request');
        });
    });
  });

});