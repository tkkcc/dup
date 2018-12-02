const got = require('got')
const find = async (l, r) => {
  while (r > l + 1) {
    let m = ((l + r) / 2) >> 0
    let a = await got('https://i.dmzj.com/otherCenter/hisSubscribe?hisUid=' + m)
    if ('该用户不存在' === a.body) r = m
    else l = m
    console.log(l, r)
    // await new Promise(resolve => setTimeout(resolve, 1000))
  }
  console.log(r)
}
find(101198335, 123398751)
// 108399437
