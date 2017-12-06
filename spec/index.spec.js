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
  describe('GET /api/topics', () => {
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
  describe('GET /api/topics/:topic_id/articles', () => {
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
        .send({ body: 'This is my first comment', belongs_to: `${usefulData.comments[0].belongs_to}`, created_by: 'northcoder', votes: 0, created_at: Date.now() })
        .expect(400)
        .then(res => {
          expect(res.body.msg).to.equal('bad request');
        });
    });
  });

  describe('PUT /api/articles/:article_id', () => {
    it('increments the vote count of the article by 1 when vote=up', () => {
      return request
        .put(`/api/articles/${usefulData.articles[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.vote.votes).to.equal(1);
        });
    });
    it('decrements the vote count of the article by 1 when vote=down', () => {
      return request
        .put(`/api/articles/${usefulData.articles[1]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.vote.votes).to.equal(-1);
        });
    });
  });


  describe('PUT /api/comments/:comment_id', () => {
    it('increments the vote count of the comment by 1 when vote=up', () => {
      return request
        .put(`/api/comments/${usefulData.comments[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comment.votes).to.equal(1);
        });
    });
    it('decrements the vote count of the comment by 1 when vote=down', () => {
      return request
        .put(`/api/comments/${usefulData.comments[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body.comment.votes).to.equal(-1);
        });
    });
 
  });

  describe('DELETE /api/comments/:comment_id/', () => {
    it('deletes a comment by comment ID', () => {
      return request
        .delete(`/api/comments/${usefulData.comments[0]._id}`)
        .expect(202)
        .then(res => {
          expect(res.body.comment_deleted._id).to.equal(`${usefulData.comments[0]._id}`);
          expect(res.body.message).to.equal('deleted');
        })
        .then(() => {
          return request
            .get(`/api/articles/${usefulData.comments[0].belongs_to}/comments`)
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an('array');
              expect(res.body.comments.length).to.equal(1);
              expect(res.body.comments[0].body).to.be.a('string');
            });
        });
    });
  });
});

