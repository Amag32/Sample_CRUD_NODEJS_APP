"use strict";

var sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    mongoose = require('mongoose');

require('sinon-mongoose');

//Importing our models for our unit testing.
var PermissionModel = require('../models/Permission');

// Test will pass if we get all permissions
describe("Get all permissions", function(){
  it("should return all permissions", function(done){
    var PermissionMock = sinon.mock(PermissionModel);PermissionMock
    var expectedResult = {error: null, result: []};
    PermissionMock.expects('find').yields(null, expectedResult);
    PermissionModel.find(function (err, result) {
      PermissionMock.verify();
      PermissionMock.restore();
      expect(result.error).to.be.null;
      done();
    });
  });
});

// Test will pass if we delete a given permission
describe('Delete permissions test', function () {
  it('Should delete permissions of given id', function (done) {
    var PermissionMock = sinon.mock(PermissionModel);
    PermissionMock
        .expects('remove')
        .withArgs({_id: 12345})
        .yields(null, 'DELETED');
    PermissionModel.remove({_id: 12345}, function(err, result){
      PermissionMock.verify();
      PermissionMock.restore();
      done();
    })
  });
});
