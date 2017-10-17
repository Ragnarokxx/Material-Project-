const express = require('express')

var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var now = new Date();
var cors = require('cors')


const app = express()

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var connection = mongoose.createConnection("mongodb://localhost:27017/Company");
var Float = require('mongoose-float').loadType(mongoose);
mongoose.Promise = global.Promise;
var  autoNumber = require('mongoose-auto-number');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


autoNumber.init(connection);
app.use(cors());


var companySchema = new Schema({
    orderld:  {
        type: Number,
        autoIncrement: true
       },
    companyName : String ,
    customerAddress :String ,
    orderedltem:{ type: Number, default:0},
    orderCost : { type: String, default:0},
    orderDate: { type: String, default: dateFormat(now, "isoDateTime") }
});

companySchema.plugin(autoNumber.plugin, 'Company');


var Company = connection.model('Company', companySchema);

app.get('/order/read', function (req, res) {

    Company.find().exec(function (err, company) {

        if (err) {
            console.log(err);
        } else {
            res.json(company);
        }



    });
});


app.get('/order/remove/:id', function (req, res) {


    if(req.params.id) {

        Company.remove({orderld: req.params.id}, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.json({'removed':true});
            }


        });
    }



});



app.get('/order/read/:id', function (req, res) {


    if(req.params.id) {

        Company.findOne({orderld: req.params.id}, function (err, company) {
            if (err) {
                console.log(err);
            } else {
                res.json(company);
            }


        });
    }
 
});


app.post('/order/update/:id', function (req, res) {


    if(req.params.id) {


        // POST
       var companyName = ((req.body.companyName) ? req.body.companyName:'');
       var customerAddress = ((req.body.customerAddress) ? req.body.customerAddress:'');
       var orderedltem = ((req.body.orderedltem) ? req.body.orderedltem:0);
       var orderCost  = ((req.body.orderCost) ? req.body.orderCost:0) ;



        Company.update({orderld: req.params.id}, { $set: {
            companyName: companyName,
            customerAddress: customerAddress,
            orderedltem: orderedltem,
            orderCost: orderCost


        }}, { new: true }, function (err, order) {
            if (err) {
                console.log(err);
            } else {
                res.json({'save': true});
            }

        });


    }

});








 
app.post('/order/create', function (req, res) {

    var companyName = ((req.body.companyName) ? req.body.companyName:'');
    var customerAddress = ((req.body.customerAddress) ? req.body.customerAddress:'');
    var orderedltem = ((req.body.orderedltem) ? req.body.orderedltem:0);
    var orderCost  = ((req.body.orderCost) ? req.body.orderCost:0) ;



    var newOrder = new Company({
        companyName:companyName,
        customerAddress:customerAddress,
        orderedltem:orderedltem,
        orderCost :orderCost
    });
    newOrder.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.json({'save': true});
        }
    });

});


app.listen(3000, function () {
    console.log('App listening on port 3000!');
});

