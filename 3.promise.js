function Promise(executor) {
  this.status = 'PENDING';
  this.onResolveCallbacks = [];
  this.onRejectCallbacks = [];
  this.value = ''; // 成功的值
  this.reson = ''; // 失败的原因
  const self = this;
  function resolve(value) {
    self.value = value;
    self.status = 'RESOLVED';
    if (self.onRejectCallbacks.length = 0) return;
    self.onResolveCallbacks.forEach(function(fn) {
      fn(self.value);
    })
  }
  function reject(reason) {
    self.reason = reason;
    self.status = 'REJECT';
    if (self.onRejectCallbacks.length = 0) return;
    self.onRejectCallbacks.forEach(function(fn) {
      fn(self.reason);
    })
  }
  try {
    executor.call(this, resolve, reject);
  } catch(e) {
    console.warn('EXECUTOR ERROR')
  }
}

Promise.prototype.then = function(onResolve, onReject) {
  const self = this;
  let promise2;
  const operate = {
    RESOLVED: (resolve, promise2) => {
      let x = onResolve(self.value);
      // 如果不是返回的promise并且有链式调用，则直接将返回值resolve到下一个流程
      if (!(x instanceof Promise) && (typeof promise2.then == 'function')) {
        resolve(x);
      }
    },
    REJECT: (reject) => {
      let x = onReject(self.reason);
      if (!(x instanceof Promise) && (typeof promise2.then == 'function')) {
        onReject(x);
      }   
    }
  }
  promise2 = new Promise(function(resolve, reject) {
    if (['RESOLVED', 'REJECT'].indexOf(self.status) >= 0) {
      self.status == 'RESOLVED' && operate.RESOLVED(resolve, this);
      self.status == 'REJECT' && operate.REJECT(reject, this);
    } else if (self.status == 'PENDING') {
      self.onResolveCallbacks.push(operate.RESOLVED.bind(null, resolve, this));
      self.onRejectCallbacks.push(operate.REJECT.bind(null, reject, this));
    }
  })
  return promise2;
}

module.exports = Promise;