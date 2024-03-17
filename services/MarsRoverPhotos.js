const axios = require('axios')
const dateUtil = require('date-fns')
const urlBuilder = require('../utilities/urlBuilder')
const { DATE_TEMPLATE } = require('../utilities/dates')

const PATH_MarsCuriousityPhotoManifest = process.env.PATH_MarsCuriousityPhotoManifest
const PATH_MarsCuriousityPhotos = process.env.PATH_MarsCuriousityPhotos

// MARK: queryParams: api_key
const getPhotoManifestData = async (urlSearchParams) => {
  const manifestUrl = urlBuilder.make(PATH_MarsCuriousityPhotoManifest, urlSearchParams)
  return await axios.get(manifestUrl);
};

// MARK: queryParams: api_key, earth_date
const getPhotos = async (urlSearchParams) => {
  const url = urlBuilder.make(PATH_MarsCuriousityPhotos, urlSearchParams)
  return await axios.get(url);
}

// MARK: queryParams: api_key
exports.getMostRecentPhoto = async (urlSearchParams) => {
  const { data: manifestData } = await getPhotoManifestData(urlSearchParams)
  const earth_date = dateUtil.format(manifestData.photo_manifest.max_date, DATE_TEMPLATE)

  urlSearchParams.append("earth_date", earth_date)

  const { data: photosData } = await getPhotos(urlSearchParams)
  return photosData.photos.pop().img_src // pop() is quicker than slice(-1)
}
