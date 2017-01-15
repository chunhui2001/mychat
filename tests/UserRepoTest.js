var assert = require('assert'),
//    client = require('fakeredis').createClient('test'),
    UserRepo = require('../repository/user-repository');


var redis = require('redis');
var client = require('../providers/RedisProvider')['REDIS_BASE_CLIENT'];

var ObjectId  = require('bson-objectid');

describe('Repository Test', function(){

  "use strict";

  // beforeEach(function(){
  //   client.flushdb();
  // });

  // afterEach(function(){
  //   client.flushdb();
  // });

  it('list users', function(done){

    UserRepo.list(client).done(function (users) {
      assert.equal(true, users !== null);
      assert.equal('object', typeof users);
      assert.equal(true, Object.keys(users).length >= 0);  
      done();
    });


    // var noUsername = repo.getVote('default:users:josh', client);
    // noUsername.done(null, function(err){
    //   assert.equal(err, 'Username is null');
    // });

    // //setup the data
    // client.set('default:users:josh', 'josh');
    // client.set('default:users:josh:vote', JSON.stringify({test: 'test'}));

    // //make sure the function gets the correct keys
    // var getVote = repo.getVote('default:users:josh', client);
    // getVote.done(function(vote){
    //   assert.equal(vote.username, 'josh');
    //   assert.equal(vote.fs.test, 'test');
    //   done();
    // });
  });


  it('add a user', function (done) {

    UserRepo.add({username: 'keesh.zhang', ticket: ObjectId.generate()}, client).done(function (isOk) {
      assert.equal('OK', isOk);
      done();
    });

  });


  it('delete a user', function (done) {

    UserRepo.add({username: 'keesh.zhang2', ticket: ObjectId.generate()}, client).done(function (isOk) {
      assert.equal('OK', isOk);  
      UserRepo.remove('keesh.zhang2', client).done(function (affectRowCount) {
        assert.equal(1, affectRowCount);
        done();
      });
      // done();
    });

  });

});
