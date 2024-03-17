const neoWs = require('../services/NeoWs')

exports.getMeteors = async (req, res, next) => {
  try {
    const { is_potentially_hazardous_asteroid = '', is_counted = '', ...rest} = req.query;
    console.log(req.query);
    const { data } = await neoWs.getMeteors(makeQueryParams(rest));
    res.status(200).json(filterData(data.near_earth_objects, is_potentially_hazardous_asteroid, is_counted) )
  } catch(err) {
    console.log(err)
    res.status(err.response.status || 500).json({message: 'getMeteors request has failed!', error: err.message})
  }
}

const makeQueryParams = (query) => {

  const START_DATE = "start_date"
  const END_DATE = "end_date"
  const API_KEY = "api_key"

  const urlSearchParams = new URLSearchParams({})

  query.hasOwnProperty(START_DATE) && params.append(START_DATE, query[START_DATE])
  query.hasOwnProperty(END_DATE) && params.append(END_DATE, query[END_DATE])
  query.hasOwnProperty(API_KEY) && params.append(API_KEY, query[API_KEY])

  return urlSearchParams
}

const parseItem = (el) => ({
  id: el.id,
  name: el.name,
  diameter_in_meters: el.estimated_diameter.meters,
  is_potentially_hazardous_asteroid: el.is_potentially_hazardous_asteroid,
  close_approach_date_full: el.close_approach_data[0].close_approach_date_full,
  relative_velocity: { kilometers_per_second: el.close_approach_data[0].relative_velocity.kilometers_per_second }
})

const filterData = (earthObjects, hazardous, count) => Object.keys(earthObjects).reduce((acc, key) => {

    const filteredData = earthObjects[key].reduce((acc, item) => {
      if (hazardous === 'yes' && item.is_potentially_hazardous_asteroid) {
        acc.push(parseItem(item))
      } else if (hazardous === 'no' && !item.is_potentially_hazardous_asteroid) {
        acc.push(parseItem(item))
      } else if (!hazardous) {
        acc.push(parseItem(item))
      }
      return acc
    }, [])

    if (filteredData.length) {
      if (count === 'true') {
      acc[key] = {
        count: filteredData.length,
        asteroids: filteredData
      }
    } else {
        acc[key] = filteredData
      }
    }

    return acc
  }, {})
