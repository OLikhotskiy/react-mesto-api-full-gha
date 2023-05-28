const Forbidden = require('../errors/Forbidden');

const Card = require('../models/card');
const { CREATED_CODE } = require('../utils/constants');
// GET ALL CARDS
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};
// NEW CARD
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;
  Card.create({ name, link, owner: id })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch(next);
};
// DELETE CARD
module.exports.deleteCard = (req, res, next) => {
  const _id = req.params.cardId;
  Card.findOne({ _id })
    .orFail()
    .then((card) => {
      if (card.owner._id.toString() === req.user._id.toString()) {
        card.deleteOne()
          .then(() => res.send({ message: 'Карточка удалена' }))
          .catch(next);
      } else {
        next(new Forbidden('Невозможно удалить карточку другого пользователя'));
      }
    })
    .catch(next);
};
// CARD LIKES
function updateCardLikes(req, res, updateData, next) {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
}
// LIKE CARD
module.exports.likeCard = (req, res, next) => {
  const owner = req.user._id;
  const newData = { $addToSet: { likes: owner } };
  updateCardLikes(req, res, newData, next);
};
// DISLIKE CARD
module.exports.dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  const newData = { $pull: { likes: owner } };
  updateCardLikes(req, res, newData, next);
};
