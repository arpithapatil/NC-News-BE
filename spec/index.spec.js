process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);
const { expect } = require('chai');
const saveTestData = require('../seed/test.seed');
const { Articles, Comments, Users, Topics } = require('../models/models');