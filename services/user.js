const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/passport/passport');
const bcrypt = require('bcryptjs')

module.exports = (app, db) => {
  app.post('/registerUser', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        const data = {
          name: data.first_name,
          username: data.username,
          role: "user"
        };
        console.log(data);
        db.user.findOne({
          where: {
            username: data.username,
          },
        }).then(user => {
          console.log(user);
          user
            .update({
              name: data.first_name,
              username: data.username,
              role: data.role
            })
            .then(() => {
              console.log('user created in db');
              res.status(200).send({ message: 'user created' });
            });
        })
          .catch(err => {
            console.log(err)
          })

      }
    })(req, res, next);
  });

  app.post('/loginUser', (req, res, next) => {
    passport.authenticate('login', (err, users, info) => {
      if (err) {
        console.error(`error ${err}`);
      }
      if (info !== undefined) {
        console.error(info.message);
        if (info.message === 'bad username') {
          res.status(401).send(info.message);
        } else {
          res.status(403).send(info.message);
        }
      } else {
        db.user.findOne({
          where: {
            username: req.body.username,
          },
        }).then(user => {
          const token = jwt.sign({ id: user.id, role: user.role }, config.jwtOptions.secretOrKey, {
            expiresIn: 36000000,
          });
          res.status(200).send({
            auth: true,
            token,
            message: 'user found & logged in',
          });
        });
      }
    })(req, res, next);
  });


  app.put('/change-password', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 1
      db.user.findOne({
        where: { id: req.user.id }
      })
      .then(user => {
        user.update({
          password: req.body.password
        })
        .then(()=>{
          console.log('your password is now change.');
          res.status(201).send('your password is now change.');
        })
        .catch(err =>{
          console.error(err);
          res.status(400).send(err.message);
        })
      })
      .catch(err =>{
        console.error(err);
        res.status(400).send(err.message);
      })
    })

  app.get('/user/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 2
      db.user.findOne({
        where: { id: req.params.id }
      })
      .then(result => {
        console.log(result);
        res.status(201).send(result);
      })
      .catch(err =>{
        console.error(err);
        res.status(400).send(err.message);
      })
    });
}
