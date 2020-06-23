const Async = {
  resolve,
  reject,
  all,
  then,
  catch: _catch
}

module.exports = {
  Async
}

function resolve (value) {
  return Promise.resolve(value)
}

function reject (reason) {
  return Promise.reject(reason)
}

function all (promises) {
  return Promise.all(promises)
}

function then (onFulfilled, onRejected) {
  return promise => promise.then(onFulfilled, onRejected)
}

function _catch (onRejected) {
  return promise => promise.catch(onRejected)
}