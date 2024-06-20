const AWS = require('aws-sdk');
const axios = require('axios');
const uuid = require('uuid');

const ses = new AWS.SES();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3/simple/price'

module.exports.getCryptoPrice = async (event) => {
    console.log(' getCryptoPrice event ==> ', event)
    console.log(' getCryptoPrice process.env.SES_EMAIL ==> ', process.env.SES_EMAIL)
    console.log(' getCryptoPrice process.env.TABLE_NAME ==> ', process.env.TABLE_NAME)

    const { crypto, email } = event.queryStringParameters;

    try {
        const response = await axios.get(`${COINGECKO_API_BASE}?ids=${crypto}&vs_currencies=usd`);

        const price = response.data[crypto].usd;


        const emailParams = {
            Source: process.env.SES_EMAIL,
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Subject: {
                    Data: `Current Price of ${crypto}`,
                },
                Body: {
                    Text: {
                        Data: `The current price of ${crypto} is $${price}.`,
                    },
                },
            },
        };

        await ses.sendEmail(emailParams).promise();


        const searchId = uuid.v4();
        const timestamp = new Date().toISOString();

        await dynamoDB.put({
            TableName: process.env.TABLE_NAME,
            Item: {
                searchId,
                crypto,
                timestamp,
                email,
            },
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `The current price of ${crypto} is $${price}. An email has been sent to ${email}.`,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

module.exports.getSearchHistory = async () => {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
        };

        const data = await dynamoDB.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};