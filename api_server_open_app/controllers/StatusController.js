var modelLocation = '../models/Status';

var util = require('util');
var express = require('express');
var bodyParser = require('body-parser'); 

/**  Model and route setup **/
var model = require(modelLocation).model; 

const route = require(modelLocation).route;
const routeIdentifier = util.format('/%s', route);

/** App setup **/

var router = express.Router(); 

 router.use('*', function (req, res, next) {
 	//  intercept here
 		next(); 
 });
  
/*
 * GET /create
 *
 */

 router.get(routeIdentifier+'/create', function(req, res, next) {
    if (req.query === undefined || req.query.client_id === undefined || req.query.username === undefined) {
        return res.json({
            status: 'Failure',
            message: 'Both username and client_id must be defined in the query string!'
        });
    }

    if (req.query.username === "") {
        return res.json({
            status: 'Failure',
            message: 'Username cannot be empty!'
        });
    }

    if (req.query.client_id === "") {
        return res.json({
            status: 'Failure',
            message: 'client_id cannot be empty!'
        });
    }

 	model.create(req.query, function (err, entry) {
 		if (err) return res.send(err);

        return res.json({
            status: 'Success',
            message: 'User was created!'
        });
 	});
 });

  /*
 * GET /get/:username
 *
 */

 router.get(routeIdentifier+'/get/:username', function (req, res, next) {
    model.findOne({
       'username':req.params.username
   }, function (err, entry){
        if(err) return res.send(err);
        return res.json(entry);
    });
});

/*
 * GET /list/online
 *
 */

router.get(routeIdentifier+'/list/online', function(req, res, next) {
    model.find({'flag':1}, function (err, objects) {
        if (err) return res.send(err);
        return res.json(objects);
    });
});

/*
 * GET /list/offline
 *
 */

router.get(routeIdentifier+'/list/offline', function(req, res, next) {
    model.find({'flag':2}, function (err, objects) {
        if (err) return res.send(err);
        return res.json(objects);
    });
});

/*
* GET /update/:username
*
*/

router.get(routeIdentifier+'/update/:username', function(req, res, next) {
    model.findOneAndUpdate({
       'username':req.params.username
   },
   req.query,
   function (err, entry) {
        if (err) return res.send(err);
        return res.json({status: 'Success', message: 'Updated'});
    });
});

/*
* GET /delete/:username
*
*/

router.get(routeIdentifier+'/delete/:username', function (req, res, next) {
 model.findOneAndRemove({
       'username':req.params.username
   },
   req.body,
   function (err, entry) {
       if (err) return res.send(err);
       return res.json({status: 'Success', message: 'Deleted'});
   });
});



 module.exports = router;
