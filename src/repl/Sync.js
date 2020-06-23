const Sync = {
  resolve,
  reject,
  all,
  then,
  catch: _catch
}

module.exports = {
  Sync
}

function resolve (value) {
  if (typeof value === 'object' && typeof value.err === 'object' && typeof value.val !== 'undefined') {
    return value
  } else {
    return {err: null, val: value}
  }
}

function reject (reason) {
  if (typeof reason === 'object' && typeof reason.err === 'object' && typeof reason.val !== 'undefined') {
    return {...reason, err: reason}
  } else {
    return {err: reason, val: null}
  }
}

function all (array) {
  try {
    let err = null
    const val = []

    for (let i = 0; i < array.length; i++) {
      const elem = array[i]
  
      if (typeof elem === 'object') {
        if (elem.err === null) {
          if (typeof elem.val === 'undefined') {
            val.push(elem)
          } else {
            val.push(elem.val)
          }
        } else {
          err = elem.err
          val.push(null)
        }
      } else {
        val.push(elem)
      }
    }
  
    return {err, val}
  } catch (err) {
    return {err, val: null}
  }
}

function then (onFulfilled, onRejected) {
  return ({err, val}) => {
    try {
      return {
        err: typeof onRejected  === 'function' ? onRejected(err)  : err,
        val: typeof onFulfilled === 'function' ? onFulfilled(val) : val
      }
    } catch (err) {
      return {err, val: null}
    }
  }
}

function _catch (onRejected) {
  return ({err, val}) => {
    try {
      return {err: onRejected(err), val}
    } catch (err) {
      return {err, val: null}
    }
  }
}