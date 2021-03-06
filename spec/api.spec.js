process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const testData = require('../seed/test.seed');
const { expect } = require('chai');
const app = require('../server');
const request = require('supertest');

describe('api', () => {
  let usefulData;
  beforeEach(() => {
    return mongoose.connection.dropDatabase()
      .then(testData)
      .then(data => {
        usefulData = data;
      })
      .catch(() => console.error);
  });
  describe('GET api', () => {
    it('returns with status code of 200', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.eql({
            status:'api route'
          });
        });
    });
  });

  describe('GET /*', () => {
    it('returns 404 for bad requests', () => {
      return request(app)
        .get('/milk')
        .expect(404);
    });
  });
  describe('GET /api/topics', () => {
    it('returns an array of topics with a status code of 200', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics.length).to.equal(usefulData.topics.length);
          expect(res.body.topics[0].slug).to.be.a('string');
        });
    });
  });
  describe('GET /api/topics/:topic_id/articles', () => {
    it('returns an array of topics with a status code of 200', () => {
      return request(app)
        .get(`/api/topics/${usefulData.topics[2].slug}/articles`)
        .expect(200)
        .then(res => {
          const articles = res.body;
          expect(articles).to.be.an('array');
          expect(articles[0].belongs_to).to.equal(usefulData.topics[2].slug);
          expect(articles[0].title).to.equal(usefulData.articles[0].title);
        });
    });
    it('returns a 404 error status code if parameter is not a valid topic', () => {
      return request(app)
        .get('/api/topics/apple/articles')
        .expect(404)
        .then(res => {
          const error = res.body.message;
          expect(error).to.equal('Topic not found');
        });
    });
  });
  describe('GET api/articles', () => {
    it('returns an array of articles with a status code of 200', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(usefulData.articles.length);
          res.body.forEach(article => {
            expect(article.belongs_to).to.be.oneOf([usefulData.articles[0].belongs_to, usefulData.articles[1].belongs_to]);
            expect(article.title).to.be.oneOf([usefulData.articles[0].title, usefulData.articles[1].title]);
          });
        });
    });
  });
  describe('GET /api/articles/:article_id', () => {
    it('returns the correct article', () => {
      const articleId = usefulData.articles[0]._id;
      return request(app)
        .get(`/api/articles/${usefulData.articles[0]._id}`)
        .expect(200)
        .then( res => {
          expect(res.body.length).to.equal(1);
          expect(res.body[0]._id).to.equal(articleId.toString());
        });
    });
    it('returns a 404 error status code if parameter is not a valid article_id', () => {
      const invalid_article_id = '56227d776a326fb40f000001';
      return request(app)
        .get(`/api/articles/${invalid_article_id}`)
        .expect(404)
        .then(res => {
          const error = res.body.message;
          expect(error).to.equal('Article not found');
        });
    });
  });
  describe('GET /api/articles/:article_id/comments', () => {
    it('returns an array of comments with a status code of 200', () => {
      const article_id = usefulData.articles[0]._id;
      return request(app)
        .get(`/api/articles/${usefulData.articles[0]._id}/comments`)
        .expect(200)
        .then((res) => {
          const comments = res.body;
          expect(comments).to.be.an('array');
          expect(comments[0].belongs_to).to.equal(article_id.toString());
          expect(comments[0].created_by).to.equal(usefulData.comments[0].created_by);
        });
    });
    it('returns a 404 error if parameter is a non existent id in the right format', () => {
      return request(app)
        .get('/api/articles/51224d776a326fb40f000001/comments')
        .expect(404)
        .then(res => {
          const error = res.body.message;
          expect(error).to.equal('Article not found');
        });
    });
    it('returns a 400 error if parameter is not a valid article id format', () => {
      return request(app)
        .get('/api/articles/mango/comments')
        .expect(400)
        .then(res => {
          const error = res.body.message;
          expect(error).to.equal('article_id not valid');
        });
    });
  });
  describe('POST /api/articles/:article_id/comments', () => {
    it('sends back new comment object with status code of 200', () => {
      const articleId = usefulData.comments[0].belongs_to;
      return request(app)
        .post(`/api/articles/${articleId}/comments`)
        .expect(200)
        .then((res) => {
          const comments = usefulData.comments;
          expect(res.body[0].created_by).to.equal('northcoder');
          expect(res.body.length).to.equal(comments.length + 1);
        });
    });
  
    it('returns a 400 error if the body of the comment is an empty string or a string of whitespaces', () => {
      const comment = '   ';
      return request(app)
        .post(`/api/articles/${usefulData.articles[0]._id}/comments`)
        .send({ comment })
        .expect(400)
        .then(res => {
          const error = res.body.message;
          expect(error).to.equal('Provide comment body');
        });
    });
  });
  describe('PUT /api/articles/:article_id?vote=down', () => {
    it('decreses the number of votes for the article selected and return a status code of 200', () => {
      const votes = usefulData.articles[0].votes;
      return request(app)
        .put(`/api/articles/${usefulData.articles[0]._id}?vote=down`)
        .expect(200)
        .then(res => {
          const newVotes = res.body.article.votes;
          expect(newVotes).to.equal(votes - 1);
        });
    });
    it('returns a 400 error if parameter is not a valid article id', () => {
      return request(app)
        .put('/api/articles/apple?vote=down')
        .expect(400)
        .then((res) => {
          const error = res.body.message;
          expect(error).to.equal('Article not found');
        });
    });
  });
  describe('PUT /api/articles/:article_id?vote=up', () => {
    it('increases the number of votes for the article selected and return a status code of 200', () => {
      const votes = usefulData.articles[0].votes;
      return request(app)
        .put(`/api/articles/${usefulData.articles[0]._id}?vote=up`)
        .expect(200)
        .then(res => {
          const newVotes = res.body.article.votes;
          expect(newVotes).to.equal(votes + 1);
        });
    });
    it('returns a 400 error if parameter is not a valid article id', () => {
      return request(app)
        .put('/api/articles/mango?vote=up')
        .expect(400)
        .then((res) => {
          const error = res.body.message;
          expect(error).to.equal('Article not found');
        });
    });
  });
  describe('PUT /api/comments/:comment_id?vote=down', () => {
  
    it('updates comment votes with down vote', () => {
      const commentId = usefulData.comments[1]._id;
      const prevVotes = usefulData.comments[1].votes;
      return request(app)
        .put(`/api/comments/${commentId}?vote=down`)
        .expect(200)
        .then((res) => {
          expect(res.body.votes).to.equal(prevVotes - 1);
        });
    });
    it('returns correct status code for invalid comment id', () => {
      return request(app)
        .put('/api/comments/123?vote=down')
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid comment ID');
        });
    });
  });
    
  describe('PUT /api/comments/:comment_id?vote=up', () => {
    it('updates comment votes with up vote', () => {
      const commentId = usefulData.comments[0]._id;
      const prevVotes = usefulData.comments[0].votes;
      return request(app)
        .put(`/api/comments/${commentId}?vote=up`)
        .expect(200)
        .then((res) => {
          expect(res.body.votes).to.equal(prevVotes + 1);
        });
    });
    it('returns correct status code for invalid comment id', () => {
      return request(app)
        .put('/api/comments/123?vote=up')
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.equal('Invalid comment ID');
        });
    });
  });
  describe('DELETE /api/comments/:comment_id', () => {
    it('removes correct comment and status code', () => {
      const commentId = usefulData.comments[0]._id;
      const numComments = usefulData.comments.length;
      return request(app)
        .delete(`/api/comments/${commentId}`)
        .query({ article_id: `${usefulData.comments[0].belongs_to}` })
        .expect(200)
        .then((res) => {
          expect(res.body.length).to.equal(numComments-1);
        });  
    });
    it('returns a 400 error if parameter is not a valid comment id', () => {
      return request(app)
        .delete('/api/comments/orange')
        .expect(400)
        .then((res) => {
          const error = res.body.message;
          expect(error).to.equal('Comment not found');
        });
    });
  });
  describe('GET /api/users/:username', () => {
    it('returns only the correct user with a status code of 200', () => {
      const username = usefulData.user.username;
      return request(app)
        .get(`/api/users/${usefulData.user.username}`)
        .expect(200)
        .then(res => {
          const user = res.body.user;
          expect(user.username).to.equal(username);
        }); 
    });
    it('returns a 404 error if parameter is not a valid username', () => {
      return request(app)
        .get('/api/users/orange')
        .expect(404)
        .then((res) => {
          const error = res.body.message;
          expect(error).to.equal('Username does not match any user');
        });
    });
  });
});


