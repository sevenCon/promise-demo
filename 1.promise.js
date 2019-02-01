function Promise(fn) {
  this.state = "pending";
  this.value = null;
  this.reason = null;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  let that = this;

  function resolve(value) {
    if (that.state != "pending") return;
    that.state = "fulfilled";
    that.value = value;
    that.onFulfilledCallbacks.forEach(fn => {
      fn();
    });
  }

  function reject(reason) {
    if (that.state != "pending") return;
    that.state = "rejected";
    that.reason = reason;

    that.onRejectedCallbacks.forEach(fn => {
      fn();
    });
  }
 
  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
}


function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) return reject(new TypeError("循环引用"));
  let called;
  
  // x 是个函数或者对象, 并且 null , String , function , Object,
  if (typeof x === "function" || typeof x === "object" && x !== null) {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, function(y) {
          if(called) return;
          called = true;
          resolvePromise(promise, y, resolve, reject);
        },function(r) {
          if(called) return;
          called = true;
          reject(r);
        });
      } else {
        resolve(x);
      }
    } catch (e) {
      if(called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

Promise.prototype.then = function(onFulfilledFn, onRejectedFn) {
  let that = this;

  onFulfilledFn = typeof onFulfilledFn === "function" ? onFulfilledFn : function(value) {
    return value;
  };
  onRejectedFn = typeof onRejectedFn === "function" ? onRejectedFn : function(value) {
    throw value;
  };

  let p2 = new Promise(function(resolve, reject) {
    if (that.state == "pending") {
      that.onFulfilledCallbacks.push(function() {
        setTimeout(() => {
          try {
            let value = onFulfilledFn(that.value);
            resolvePromise(p2, value, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
      that.onRejectedCallbacks.push(function() {
        setTimeout(() => {
          try {
            let value = onRejectedFn(that.reason);
            resolvePromise(p2, value, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }

    if (that.state == "fulfilled") {
      setTimeout(() => {
        try {
          let value = onFulfilledFn(that.value);
          resolvePromise(p2, value, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }

    if (that.state == "rejected") {
      setTimeout(() => {
        try {
          let value = onRejectedFn(that.reason);
          resolvePromise(p2, value, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    }
  });

  return p2;
};

/**
 * catch, 捕捉上一级Promise throw的Error, 
 */
Promise.prototype.catch = function(fn){
  let that = this;
  return that.then(null, fn);
};

// 类上的方法
Promise.resolve = function (value) {
  return new Promise(function (resolve, reject) {
    resolve(value);
  });
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
}
Promise.deferred = Promise.defer = function(value){
  let ret = {};
  ret.promise = new Promise(function(resolve, reject){
    ret.resolve = resolve;
    ret.reject = reject;
  });
  return ret;
}

module.exports = Promise;
