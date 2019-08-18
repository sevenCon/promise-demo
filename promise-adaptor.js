var promisesAplusTests = require('promises-aplus-tests');
var promise = require('./promise.js');
promisesAplusTests(promise, function(err) {
  // All done; output is in the console. Or check `err` for number of failures.
  console.log('finished all test case!');
  console.log(err);
});
