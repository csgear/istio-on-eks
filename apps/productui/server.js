const express = require('express');
const bodyParser= require('body-parser')
const axios = require('axios')
const app = express()
const path = require("path");
const Prometheus = require('prom-client')

var http = require('http');

app.use(bodyParser.urlencoded({extended: false}));

Prometheus.collectDefaultMetrics();

var baseProductUrl = process.env.BASE_URL;

if(baseProductUrl === undefined)  {
    baseProductUrl = 'http://localhost:5000/products/';
}

console.log(baseProductUrl);

// ========================
// Middlewares
// ========================
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    let query = req.query.queryStr;

    let tenant_id = req.header('x-tenant') ?? 'tpm'
    
    console.log("Product ui received headers: ", tenant_id);
    // forward headers to axios calls
    let headers = {
      'x-tenant': tenant_id
    } ;
     
    const requestOne = axios.get(baseProductUrl, {headers: headers});
    axios.all([requestOne]).then(axios.spread((...responses) => {
      const responseOne = responses[0]
      res.render('index.ejs', {products: responseOne.data.products, vendors:responseOne.data.details.vendors, version:responseOne.data.details.version})
      console.log("Product Catalog get call was Successful from productui");
    })).catch(errors => {
      console.log(errors);
      console.log("There was error in Product Catalog get call from productui");
    })
})

app.post('/products', (req, res) => {
  let headers = {
    'Content-Type': 'application/json',
  } ;
   
  axios
    .post(`${baseProductUrl}${req.body.id}`, JSON.stringify({ name: `${req.body.name}` }), {"headers" : headers})
    .then(response => {
      res.redirect(req.get('referer'));
      console.log("Product Catalog post call was Successful from productui");
    })
    .catch(error => {
      // console.error(error)
    })

})

app.get("/ping", (req, res, next) => {
  res.json("Healthy")
});

// Export Prometheus metrics from /metrics endpoint
app.get('/metrics', (req, res, next) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})


app.listen(9000, function() {
      console.log('listening on 9000')
})