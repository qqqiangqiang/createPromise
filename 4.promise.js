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
function resolvePromise(x, executor, promise2) {
  let then = x.then;
  // 手动添加一个then，接收内部promise的data，并调用最外层生成的promise的resolve，将值传递给外层promise的then
  then.call(x, function(data) {
    executor(data);
  })
}
Promise.prototype.then = function(onResolve, onReject) {
  const self = this;
  const operate = {
    RESOLVED: (resolve, promise2) => {
      let x = onResolve(self.value);
      // 如果不是返回的promise并且有链式调用，则直接将返回值resolve到下一个流程
      if (!(x instanceof Promise) && (typeof promise2.then == 'function')) {
        resolve(x);
      } else {
        resolvePromise(x, resolve, promise2)
      }
    },
    REJECT: (reject) => {
      let x = onReject(self.reason);
      if (!(x instanceof Promise) && (typeof promise2.then == 'function')) {
        onReject(x);
      } else {
        resolvePromise(x, resolve, promise2)
      }
    }
  }
  return new Promise(function(resolve, reject) {
    if (['RESOLVED', 'REJECT'].indexOf(self.status) >= 0) {
      self.status == 'RESOLVED' && operate.RESOLVED(resolve, this);
      self.status == 'REJECT' && operate.REJECT(reject, this);
    } else if (self.status == 'PENDING') {
      self.onResolveCallbacks.push(operate.RESOLVED.bind(null, resolve, this));
      self.onRejectCallbacks.push(operate.REJECT.bind(null, reject, this));
    }
  })
}

module.exports = Promise;