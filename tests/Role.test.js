"use strict";

var sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    mongoose = require('mongoose');

require('sinon-mongoose');

//Importing our models for our unit testing.
var RoleModel = require('../models/Role');


// Test will pass if we get all roles
describe("Get all roles", function(){
  it("should return all roles", function(done){
    var RoleMock = sinon.mock(RoleModel);
    var expectedResult = {error: null, result: []};
    RoleMock.expects('find').yields(null, expectedResult);
    RoleModel.find(function (err, result) {
      RoleMock.verify();
      RoleMock.restore();
      expect(result.error).to.be.null;
      done();
    });
  });
});

// Test will pass if we delete a given role
describe('Delete role test', function () {
  it('Should delete role of given id', function (done) {
    var RoleMock = sinon.mock(RoleModel);
    RoleMock
        .expects('remove')
        .withArgs({_id: 12345})
        .yields(null, 'DELETED');
    RoleModel.remove({_id: 12345}, function(err, result){
      RoleMock.verify();
      RoleMock.restore();
      done();
    })
  });
});