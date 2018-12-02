const channel = 'Android'
const version = '2.7.009'
const api1 = 'http://interface.dmzj.com'
const api3 = 'https://v3api.dmzj.com'
// const api3 = 'https://interface.dmzj.com';
const api_img = 'https://images.dmzj.com'
// $api3/comic/$id.json?channel=$channel&version=$version
const got = require('got')
const fs = require('fs')

const ProgressBar = require('progress')
const { JSDOM } = require('jsdom')
const comic = async id => {
  let res = await got(`${api3}/comic/${id}.json?channel=${channel}&version=${version}`)
  if (res.statusCode != 200) return
    let a = JSON.parse(res.body)
    a = a.chapters[0].data.map(i => ({
      id: i.chapter_id,
      order: i.chapter_order,
      title: i.chapter_title,
      size: i.filesize,
      time:i.updatetime
    }))
    fs.writeFileSync('f.json',JSON.stringify(a))
}

comic(46092)
