const express = require('express');
const axios = require('axios');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const Promise = require('bluebird');
const expect = chai.expect;
const supertest = require('supertest');
const bodyParser = require('body-parser');

chai.use(sinonChai);

describe('Case Controller Tests', () => {

  describe('findByContactId Success Tests', () => {
    let axiosGetStub;
    let axiosGetSpy;
    let findByContactId;
    let request;
    let app;

    beforeEach(() => {
      axiosGetStub = (url, body, params) => {
        return new Promise((resolve, reject) => {
          resolve({ data: 'TEST CASE DATA'});
        });
      }

      axiosGetSpy = sinon.spy(axiosGetStub);

      findByContactId = proxyquire('../../server/controllers/salesforce/case.js', {
        axios: {
          get: axiosGetSpy
        }
      }).findByContactId;

      app = express();
      request = supertest(app);

      app.get('/test', findByContactId);
    });

    it('Should make an axios GET request', (done) => {
      request.get('/test').query({ id: 0000000}).end((err, res) => {
        expect(axiosGetSpy).to.have.been.called;
        done();
      });
    });

    it('Should add an authorization header to the axios GET request', (done) => {
      request.get('/test').query({ id: 0000000}).expect(200, (err, res) => {
        const headers = axiosGetSpy.args[0][1].headers;
        expect(headers).to.have.keys('Authorization');
        done();
      });
    })

    it('Should send the case data in the response', (done) => {
      request.get('/test').query({ id: 0000000}).expect(200, (err, res) => {
        const expectedResponse = 'TEST CASE DATA';
        const actualResponse = res.text;
        expect(actualResponse).to.equal(expectedResponse);
        done();
      });
    })
  });

  describe('findByContactId Failure Tests', () => {
    let axiosGetErrStub;
    let findByContactId;
    let request;
    let app

    beforeEach(() => {
      axiosGetErrStub = (url, body, params) => {
        return new Promise((resolve, reject) => {
          reject({response: {data: 'TEST ERROR'}});
        });
      }

      findByContactId = proxyquire('../../server/controllers/salesforce/case.js', {
        axios: {
          get: axiosGetErrStub
        }
      }).findByContactId;

      app = express();
      request = supertest(app);

      app.get('/test', findByContactId);
    });

    it('Should respond with an error if no ID parameter is present on request', (done) => {
      request.get('/test').expect(400, done);
    });

    it('Should send the error data if axios GET request fails', (done) => {
      request.get('/test').query({ id: 0000000}).end((err, res) => {
         expect(res.text).to.equal('TEST ERROR');
         done();
      });
    });
  })

  describe('creatNew Success Tests', () => {
    let axiosPostStub;
    let axiosPostSpy;
    let createNew;
    let request;
    let app;

    beforeEach(() => {
      axiosPostStub = (url, body, params) => {
        return new Promise((resolve, reject) => {
          resolve({ data: 'TEST CASE DATA'});
        });
      }

      axiosPostSpy = sinon.spy(axiosPostStub);

      createNew = proxyquire('../../server/controllers/salesforce/case.js', {
        axios: {
          post: axiosPostSpy
        }
      }).createNew;

      app = express();
      app.use(bodyParser.json({ type: 'application/json' }));
      request = supertest(app);
      app.post('/test', createNew);
    });

    it('Should make an axios POST request', (done) => {
      request.post('/test')
      .send({ id:'0000000', subject: 'TEST SUBJECT'})
      .then((res) => {
        expect(axiosPostSpy).to.have.been.called;
        done();
      });
    });

    it('Should add an authorization header to the axios POST request', (done) => {
      request.post('/test')
      .send({ id:'0000000', subject: 'TEST SUBJECT'})
      .expect(200, (err, res) => {
        const headers = axiosPostSpy.args[0][2].headers;
        expect(headers).to.have.keys('Authorization');
        done();
      });
    })

    it('Should send the case data in the response', (done) => {
      request.post('/test')
      .send({ id:'0000000', subject: 'TEST SUBJECT'})
      .expect(200, (err, res) => {
        const expectedResponse = 'TEST CASE DATA';
        const actualResponse = res.text;
        expect(actualResponse).to.equal(expectedResponse);
        done();
      });
    })
  });

  describe('creatNew Failure Tests', () => {
    let axiosPostErrStub;
    let axiosPostSpy;
    let createNew;
    let request;
    let app;

    beforeEach(() => {
      axiosPostErrStub = (url, body, params) => {
        return new Promise((resolve, reject) => {
          reject({response: {data: 'TEST ERROR'}});
        });
      }

      axiosPostSpy = sinon.spy(axiosPostErrStub);

      createNew = proxyquire('../../server/controllers/salesforce/case.js', {
        axios: {
          post: axiosPostSpy
        }
      }).createNew;

      app = express();
      app.use(bodyParser.json({ type: 'application/json' }));
      request = supertest(app);
      app.post('/test', createNew);
    });

    it('Should send an error if ID or Subject is missing from POST request', (done) => {
      request.post('/test').expect(400, done);
    });

    it('Should send the error data if axios POST request fails', (done) => {
      request.post('/test')
      .send({ id:'0000000', subject: 'TEST SUBJECT'})
      .then(res => {
        const actualResponse = res.text;
        const expectedResponse = 'TEST ERROR';
        expect(actualResponse).to.equal(expectedResponse);
        done();
      });
    });
  });

  describe('updateStatus Success Tests', () => {
    let axiosPatchStub;
    let axiosPatchSpy;
    let updateStatus;
    let request;
    let app;

    beforeEach(() => {
      axiosPatchStub = (url, body, params) => {
        return new Promise((resolve, reject) => {
          resolve({ data: 'TEST CASE DATA'});
        });
      }

      axiosPatchSpy = sinon.spy(axiosPatchStub);

      updateStatus = proxyquire('../../server/controllers/salesforce/case.js', {
        axios: {
          patch: axiosPatchSpy
        }
      }).updateStatus;

      app = express();
      app.use(bodyParser.json({ type: 'application/json' }));
      request = supertest(app);
      app.patch('/test', updateStatus);
    });

    it('Should make an axios PATCH request', (done) => {
      request.patch('/test')
      .send({ id:'0000000', status: 'TEST STATUS'})
      .then((res) => {
        expect(axiosPatchSpy).to.have.been.called;
        done();
      });
    });

    it('Should add an authorization header to the axios PATCH request', (done) => {
      request.patch('/test')
      .send({ id:'0000000', status: 'TEST STATUS'})
      .expect(200, (err, res) => {
        const headers = axiosPatchSpy.args[0][2].headers;
        expect(headers).to.have.keys('Authorization');
        done();
      });
    })

    it('Should send the response data', (done) => {
      request.patch('/test')
      .send({ id:'0000000', status: 'TEST STATUS'})
      .expect(200, (err, res) => {
        const expectedResponse = 'TEST CASE DATA';
        const actualResponse = res.text;
        expect(actualResponse).to.equal(expectedResponse);
        done();
      });
    });
  });

  describe('updateStatus Failure Tests', () => {
    let axiosPatchErrStub;
    let axiosPatchSpy;
    let updateStatus;
    let request;
    let app;

    beforeEach(() => {
      axiosPatchErrStub = (url, body, params) => {
        return new Promise((resolve, reject) => {
          reject({response: {data: 'TEST ERROR'}});
        });
      }

      axiosPatchSpy = sinon.spy(axiosPatchErrStub);

      updateStatus = proxyquire('../../server/controllers/salesforce/case.js', {
        axios: {
          patch: axiosPatchSpy
        }
      }).updateStatus;

      app = express();
      app.use(bodyParser.json({ type: 'application/json' }));
      request = supertest(app);
      app.patch('/test', updateStatus);
    });

    it('Should send an error if ID or Status is missing from PATCH request', (done) => {
      request.patch('/test').expect(400, done);
    });

    it('Should send the error data if axios POST request fails', (done) => {
      request.patch('/test')
      .send({ id:'0000000', status: 'TEST STATUS'})
      .then(res => {
        const actualResponse = res.text;
        const expectedResponse = 'TEST ERROR';
        expect(actualResponse).to.equal(expectedResponse);
        done();
      });
    });


  });
});