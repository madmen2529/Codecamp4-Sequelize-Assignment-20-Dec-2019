const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.get('/friend-request-to/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 1
      db.friend.create({
        status: 'request',
        request_to_id: req.params.id,
        request_from_id: req.user.id
      })
      .then(() => {
        let msg = 'your friend is sended.';
        console.log(msg);
        res.status(201).send(msg);
      })
      .catch(err =>{
        console.error(err);
        res.status(400).send(err.message);
      })
    }
  )

  app.get('/request-list', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 2
      db.friend.findAll({
        where :{
          request_from_id: req.user.id
        }
      })
      .then((result) => {
        // let msg = 'your friend is sended.';
        console.log(result);
        res.status(201).send(result);
      })
      .catch(err =>{
        console.error(err);
        res.status(400).send(err.message);
      })
    });

  app.get('/accept-friend-request/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 3
      db.friend.findOne({
        where :{
          request_from_id: req.params.id
        }
      })
      .then((friend) => {
        friend.update({
          status: 'friend'
        })
        .then(() => {
          let msg = 'Your friend request accepted.';
          console.log(msg);
          res.status(201).send(msg);
        })
        .catch(err => {
          console.error(err);
          res.status(400).send(err.message);
        })
        
      })
      .catch(err =>{
        console.error(err);
        res.status(400).send(err.message);
      })
    }
  )

  app.get('/deny-friend-request/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 4
      db.friend.destroy({
        where :{
          request_from_id: req.params.id,
          request_to_id: req.user.id
        }
      })
      .then((friend) => {

          let msg = 'Your friend request deny.';
          console.log(msg);
          res.status(201).send(msg);
        
      })
      .catch(err =>{
        console.error(err);
        res.status(400).send(err.message);
      })
    }
  )

  app.get('/delete-friend/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 5
      db.friend.destroy({
        where :{
          request_from_id: req.params.id
        }
      })
      .then(() => {
          let msg = 'friend delete.';
          console.log(msg);
          res.status(201).send(msg);
      })
      .catch(err =>{
        console.error(err);
        res.status(400).send(err.message);
      })
    }
  )

  app.get('/friends-list', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 6
      db.friend.findAll({
        where :{
          request_from_id: req.user.id
        }
      })
      .then((result) => {
          console.log(result);
          res.status(201).send(result);
      })
      .catch(err =>{
        console.error(err);
        res.status(400).send(err.message);
      })
    });
}