const request = require('request')

const forcast = (address, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=c33ddb0db78a9263a0a65f428649bc90&query='+address+',%20india&units=m'

    request({ url: url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.success === false) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {
                Temp: body.current.temperature,
                Weather: body.current.weather_descriptions[0],
                Location: body.location.name+' '+body.location.region+', '+body.location.country
            })
      
        }
    })
}

module.exports = forcast