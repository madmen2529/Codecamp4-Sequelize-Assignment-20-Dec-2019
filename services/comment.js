const passport = require('passport');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

module.exports = (app, db) => {
  app.post('/create-comment/:post_id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      // Lab 1
      db.post.findOne({
        where: { id: req.params.post_id}
      })
      .then(() => {
        db.comment.create({
          user_id: req.user.id,
          post_id: req.params.post_id,
          message: req.body.message
        })
          .then((result) => {
            res.status(201).send(result)
          })
          .catch((err) => {
            console.error(err);
            res.status(400).send({ message: err.message })
          })
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send({ message: err.message }) 
      })
      
    })

  app.put('/update-comment/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 2
      
      let result = await db.comment.findOne({
        where: { id: req.params.id}
      })
      .catch(err => {
        console.error(err);
        res.status(400).send({ message: err.message }) 
      })

      if(result !== undefined){
        result.update({
          message: req.body.message
        })
          .then((result) => {
            res.status(201).send(result)
          })
          .catch((err) => {
            console.error(err);
            res.status(400).send({ message: err.message })
          })
      }

    })

  app.delete('/delete-comment/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      // Lab 3
      db.comment.destroy({
        where: { id: req.params.id}
      })
      .then(() => {
        console.log('comment deleted in db');
        res.status(200).send({ message: 'comment deleted' });
      })
      .catch(err => {
        console.error(err);
        res.status(400).send({ message: err.message }) 
      })

    })
  }
