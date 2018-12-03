// case 1 基本使用
let Promise1 = require('./1.promise.js');
let p1 = new Promise1(function(resolve, reject) {
  setTimeout(function() {
    resolve('case1基本使用,lixiaolong')
  }, 1000)
}).then(function(data) {
  console.log(data);
})

// case 2 直接resolve
let Promise2 = require('./2.promise.js');
let p2 = new Promise2(function(resolve, reject) {
  resolve('case2直接resolve, lixiaolong')
}).then(function(data) {
  console.log(data);
})

// case3 链式调用
let Promise3 = require('./4.promise.js');
let p3 = new Promise3(function(resolve, reject) {
  setTimeout(function() {
    resolve('case3链式调用, lixiaolong')
  }, 2000)
}).then(function(data) {
  return data
}).then(function(data) {
  console.log(data);
})

// case4 promise链式调用
let Promise4 = require('./4.promise.js');
let p4 = new Promise4(function(resolve, reject) {
  setTimeout(function() {
    resolve('case4')
  }, 2000)
}).then(function(data) {
  return new Promise4(function(resolve, reject) {
    resolve(data + 'promise链式调用，lixiaolong');
  })
}).then(function(data) {
  console.log(data);
})