const fs = require('fs')
const got = require('got')
const ProgressBar = require('progress')
const { JSDOM } = require('jsdom')
// const body = new require('form-data')()
var FormData = require('form-data')

const cookieJar = new (require('tough-cookie')).CookieJar()
const headers = {
  Host: 'i.dmzj.com',
  Origin: 'https://i.dmzj.com',
  // Referer: 'https://i.dmzj.com/otherCenter/hisSubscribe?hisUid=101198335',
  // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  // 'User-Agent': ' Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
}
const timeout = {
  connect: 1000,
  socket: 1000,
  request:1000,
}
const result = []
const all = []
// https://github.com/rxaviers/async-pool
const asyncPool = async (poolLimit, array, iteratorFn) => {
  const bar = new ProgressBar('[:bar] :percent  :elapseds / :etas', {
    total: array.length,
    renderThrottle: 1000,
    clear: true
  })
  const ret = []
  const executing = []
  for (const item of array) {
    bar.tick()
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)
    const e = p.then(() => executing.splice(executing.indexOf(e), 1))
    executing.push(e)
    if (executing.length >= poolLimit) {
      await Promise.race(executing)
    }
  }
  return Promise.all(ret)
}
const form = (id, page) => {
  const body = new FormData()
  body.append('type_id', 1)
  body.append('letter_id', 0)
  body.append('read_id', 1)
  body.append('rightFlag', 1)
  body.append('rightLevel', 1)
  body.append('hisUid', id)
  body.append('page', page)
  return body
}
const get = async id => {
  const u = { id, subscribe: [] }
  let body = form(id, 1)
  let a = await got.post(`https://i.dmzj.com/otherCenter/ajaxGetHisSubscribe`, { body, cookieJar,headers,timeout })
  a = a.body
  const page = Math.ceil(parseInt(/var all_num =(\d+)/.exec(a)[1]) / 18)
  console.log(page)
  a = [...new JSDOM(a).window.document.querySelectorAll('dl')]
  a = a.map(i => ({
    url: i.querySelector('a').href,
    img: i.querySelector('img').src,
    title: i.querySelector('a.title').textContent
  }))
  console.log(a.length)
  u.subscribe.push(...a)
  for (let i = 2; i < page + 1; ++i) {
    // body.append('page', i)
    body = form(id, i)
    a = await got.post(`https://i.dmzj.com/otherCenter/ajaxGetHisSubscribe`, { body, cookieJar, headers,timeout })
    a = a.body
    a = [...new JSDOM(a).window.document.querySelectorAll('dl')]
    a = a.map(i => ({
      url: i.querySelector('a').href,
      img: i.querySelector('img').src,
      title: i.querySelector('a.title').textContent
    }))
    console.log(a.length)
    u.subscribe.push(...a)
  }
  console.log()
  // a = [...new JSDOM(a.body).window.document.querySelectorAll('div[data-pack-id]')]
  // try {
  //   let a = await got(`https://osu.ppy.sh/beatmaps/packs?type=${type}&page=${page}`)
  //   a = [...new JSDOM(a.body).window.document.querySelectorAll('div[data-pack-id]')]
  //   a = a.map(i => ({
  //     id: i.getAttribute('data-pack-id'),
  //     title: i.querySelector('.beatmap-pack__name').textContent,
  //     date: i.querySelector('.beatmap-pack__date').textContent,
  //     author: i.querySelector('.beatmap-pack__author--bold').textContent
  //   }))
  //   result.push(...a)
  // } catch (e) {
  //   if (retry < 5) all.push({ type, page, retry: retry + 1 })
  // }
}

const range = (a, b = a + 1) => [...Array(b - a).keys()].map(i => i + a)

const m = async () => {
  await get(101198335)
  // await asyncPool(4, all, get)
  // console.log(all)
  // fs.writeFileSync('3.json', JSON.stringify(result))
}
m()
