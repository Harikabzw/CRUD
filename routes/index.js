var express = require('express');
var router = express.Router();
var userService=require('../controller/userService')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/authenticate',authenticate)
router.post('/balanced', register);
router.get('/users', getAll);
router.get('/delete', deleteUser);

function authenticate(req, res, next) {
  console.log(req.body)
 // res.json(req.body)

  userService.authenticate(req)
      .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
      .catch(err => res.json(err));
}

function register(req, res, next) {
 // console.log(req)
  userService.create(req.body)
      .then(() => {
  console.log('successs')
  res.json({message:"Registered Successfully"})
      })
      .catch(err =>{
console.log('errr')
       next(err)});
}

function deleteUser(req, res, next) {
  console.log(req.body)
  userService.delete(req.body.id)
  .then(() => res.json({"message":"Removed User Successfully"}))
  .catch(err => next(err));
}

function getAll(req, res, next) {
  userService.getAll(req)
      .then(users => res.json(users))
      .catch(err => next(err));
}
module.exports = router;
