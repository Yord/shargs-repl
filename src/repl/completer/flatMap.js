const flatMap = (a, f) => a.reduce(
  (acc, a) => [...acc, ...f(a)],
  []
)

module.exports = {
  flatMap
}