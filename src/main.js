console.log('Start Scraping')
const path = require('path')
const request = require('request-json')
const fs = require('fs')
const _ = require('lodash')

const countries = require('./countries.js')

const batch = 1
const basefolder = path.resolve(__dirname, '../data')
const folder = path.resolve(__dirname, '../data/batch' + batch)

if (!fs.existsSync(basefolder)) {
  fs.mkdirSync(basefolder)
}
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder)
}

let client = request.createClient('http://www.dji.com/api/no-fly/country/')
// console.log(Object.keys(countries).length)

function getNextCountry () {
  const tempList = Object.keys(countries)
  if (tempList.length > 0) {
    let country = tempList[0]
    delete countries[country]
    console.log('getNextCountry', tempList[0])
    // var key = Object.keys(o)[index];
    loadData(country)
  }
  console.log('- Countries Left', tempList.length)
}

function loadData (countryCode) {
  client.get(countryCode)
    .then(function (result) {
      if (result.body.status === 400) {
        console.log('No Such Country')
        getNextCountry()
      } else {
        console.log(result.res.statusCode)
        delete result.body['header']
        // let countryCode = result.body.data[0].country
        fs.writeFileSync(folder + `/${countryCode}.json`, JSON.stringify(result.body))
        getNextCountry()
      }
    }).catch(function (err) {
      console.log(err)
      getNextCountry()
    })
}

// loadData()

getNextCountry()
getNextCountry()
getNextCountry()
getNextCountry()
getNextCountry()
console.log(Object.keys(countries).length)
