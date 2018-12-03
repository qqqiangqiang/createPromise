function P(executor) {
  this.status = 'PENDING';
  this.onResolveCallbacks = [];
  this.onRejectCallbacks = [];
  this.value = ''; // 成功的值
  this.reson = ''; // 失败的原因
  const self = this;
  function resolve(value) {
    self.value = value;
    self.status = 'RESOLVED';
    self.onResolveCallbacks.forEach(function(fn) {
      fn(self.value);
    })
  }
  function reject(reason) {
    self.reason = reason;
    self.status = 'REJECT';
    self.onRejectCallbacks.forEach(function(fn) {
      fn(self.reason);
    })
  }
  try {
    executor(resolve, reject);
  } catch(e) {
    console.warn('EXECUTOR ERROR')
  }
}

P.prototype.then = function(onResolve, onReject) {
  this.onResolveCallbacks.push(onResolve);
  this.onRejectCallbacks.push(onReject);
}

module.exports = P;