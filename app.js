import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import CryptoJS from 'crypto-js';
// import axios from 'axios';
import multer from 'multer';

dotenv.config();

const app = express();

// const upload = multer({ dest: 'uploads/' });
const storage= multer.memoryStorage(); // Use memoryStorage to deployment on Vercel
const upload = multer({ storage: storage });


// app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT;
const apiKey = process.env.IPAYMU_SANDBOX_API_KEY;
const va = process.env.IPAYMU_SANDBOX_VA;

const url = 'https://sandbox.ipaymu.com/api/v2/payment';

// app.listen(PORT, () => {
//     console.log('Server Listening on PORT: ', PORT);
// });

// app.get('/', (request, response) => {
//     const res = {
//         status: 200,
//         message: 'Success'
//     };

//     response.status(200).send(res);
// });

app.get('/', (request, response) => {
    const res = {
        status: 200,
        message: 'Success'
    };

    response.status(200).send(res);
});

app.post('/api/ipaymu/checkout', upload.single('file'), (request, response) => {

    const amount = request.body.amount;
    const num_of_product = request.body.num_of_product;
    let body = {
        'product': ['Macbook'],
        'qty': [num_of_product],
        'price' : ['14000000'],
        'amount' : amount,
        'returnUrl' : 'https://gandumbread.com/payment-gateway/success.php',
        'cancelUrl': 'https://gandumbread.com/payment-gateway',
        'notifyUrl' : 'https://gandumbread.com/payment/ipaymu/notification.php',
        'referenceId' : '086irp',
        'buyerName' : 'Prihanto',
        'buyerPhone' : '085219897296',
        'buyerEmail' : 'prihanto.edys@yahoo.com'
    };

    let bodyEncrypt = CryptoJS.SHA256(JSON.stringify(body));
    let stringToSign = 'POST:'+va+':'+bodyEncrypt+':'+apiKey;
    let signature = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(stringToSign, apiKey));

    fetch(
        url,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json', 'Content-Type' : 'application/json',
                va: va,
                signature: signature,
                timestamp: '20150201121045'
            },
            body: JSON.stringify(body)
        }
    )
    .then((response) => response.json())
    .then((responseJson) => {
        let url = '';
        // console.log(responseJson);
        if(responseJson.Status === 200){
            url = responseJson.Data.Url;
        }
        const res = {
            status: responseJson.Status,
            success: responseJson.Success,
            message: responseJson.Message,
            url_payment: url            
        };
    
        response.status(responseJson.Status).send(res);
    });
    
    
});

export default app;