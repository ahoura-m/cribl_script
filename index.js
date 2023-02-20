// Importing and setting up Libraries
require("dotenv").config( )
const AWS = require("aws-sdk")
const credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})
const s3 = new AWS.S3({ credentials: credentials })


// Grabs data from open-meteo which is a weather API provider with free access
async function getData() {
    const apiUrl ="https://api.open-meteo.com/v1/forecast?latitude=32.80&longitude=-98.00&hourly=temperature_2m,apparent_temperature,precipitation&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FChicago"
    try {
        let res = await fetch(apiUrl).then((res) => res.json())
        return res
    } catch (err) {
        console.log(err)
    }
}

getData().then((res) => {
    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `weather_${Math.floor(Date.now() / 1000)}.json`,
        Body: JSON.stringify(res),
    }
    s3.putObject(s3Params, (err, data) => {
        if (err) {
            console.log(err, err.stack)
        } else {
            console.log("JSON file successfully uploaded to S3!")
            console.log(data)
        }
    })
})
