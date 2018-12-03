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
    executor(resolve, reject);
  } catch(e) {
    console.warn('EXECUTOR ERROR')
  }
}

P.prototype.then = function(onResolve, onReject) {
  if (['RESOLVED', 'REJECT'].indexOf(this.status) >= 0) {
    const fun = {
      'RESOLVED': { 
        executor: onResolve,
        val: this.value
      },
      'REJECT': { 
        executor: onReject,
        val: this.reason
      }
    }[this.status];
    typeof fun.executor == 'function' && fun.executor.call(null, fun.val); 
    return;
  }
  
  this.onResolveCallbacks.push(onResolve);
  this.onRejectCallbacks.push(onReject);
}

module.exports = P;