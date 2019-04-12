"use strict";

var sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    mongoose = require('mongoose');

require('sinon-mongoose');

//Importing our models for our unit testing.
var UserModel = require('../models/User');

// Test will pass if we get all users
describe("Get all users", function(){
  it("should return all users", function(done){
    var UserMock = sinon.mock(UserModel);
    var expectedResult = {error: null, result: []};
    UserMock.expects('find').yields(null, expectedResult);
    UserModel.find(function (err, result) {
      UserMock.verify();
      UserMock.restore();
      expect(result.error).to.be.null;
      done();
    });
  });

});

// Test will pass if we delete a given user
describe('Delete user test', function () {
  it('Should delete user of given id', function (done) {
    var UserMock = sinon.mock(UserModel);
    UserMock
        .expects('remove')
        .withArgs({_id: 12345})
        .yields(null, 'DELETED');
    UserModel.remove({_id: 12345}, function(err, result){
      UserMock.verify();
      UserMock.restore();
      done();
    })
  });
});
