## 实现一个promise 

### Promise构造函数
- promise内部维护唯一的status值，初始状态下为'PENDING'，成功状态下为'RESOLVE'，失败状态为'REJECT'，其状态只能由'PENDING'-> 'RESOLVE' / 'PENDING' -> 'REJECT'。
- promise是一个构造函数，其内部存储着唯一的成功的``value``值与失败的``resaon``值，以及成功的回调函数队列和失败的回调函数队列。
- promise构造函函数的参数为一个执行函数，将传入两个内置函数，resolve/reject，用来执行成功或失败的回调函数队列。

```javascript
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

```

### Promise then方法
- ``promise then``接收的参数为函数，分别为成功后后的函数执行器和失败后的函数执行器。
- 全局的``value``和``reson``值将作为参数，传递给成功后的函数执行器和失败后的函数执行器。所以then的参数函数将会接收异步处理的结果。
- 为了实现promise的链式调用，每一个``then``方法将返回一个新的``Promise实例``.

```javascript
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
```