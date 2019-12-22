const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post('/create-post', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 1
      db.post.create({
        user_id: req.user.id,
        message: req.body.message,
        image_url: req.body.image_url
      })
        .then((result) => {
          res.status(201).send(result)
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.put('/update-post/:id', passport.authenticate('jwt', { session: false }),
    async function async(req, res) {
      // Lab 2
      db.post.findOne({
        where: {
          id: req.params.id
        },
      }).then(post => {
        console.log(post);
        post
          .update({
            message: req.body.message,
            image_url: req.body.image_url
          })
          .then(() => {
            console.log('post updated in db');
            res.status(200).send({ message: 'post updated' });
          });
      })
        .catch(err => {
          console.log(err)
        })

    }
  )

  app.delete('/delete-post/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 3
      db.post.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(() => {
        console.log('post deleted in db');
        res.status(200).send({ message: 'post deleted' });
      })
        .catch(err => {
          console.log(err)
        })
    })

  app.get('/my-posts', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 4
      db.post.findAll({
        where: {
          user_id: req.user.id
        }
      })
      .then(post => {
        console.log(req.user.id);
        console.log('posts');
        res.status(200).send({ post });
      })
        .catch(err => {
          console.log(err)
        })
    })

  app.get('/feed', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 5
      db.post.findAll()
      .then(post => {
        console.log('posts');
        res.status(200).send({ post });
      })
        .catch(err => {
          console.log(err)
        })
    })
}
