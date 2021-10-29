const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {

    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...req.body,
            _id: req.params.id
        })
        .then(
            () => {
                res.status(201).json({
                    message: 'Sauce modifiée avec succès !'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Sauce supprimée'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};


exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

/* 
exports.likedSauce = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;
    let sauceID = req.params.id

};
*/

// Like and Dislike part

exports.likeDislike = (req, res, next) => {
    let like = req.body.like;

    if (like === 1) {
        Sauce.updateOne({
                id: req.params.id
            }, {
                $inc: {
                    likes: req.body.like++
                },
                $push: {
                    usersLiked: req.body.userId
                }
            })
            .then((sauce) => res.status(200).json({
                message: 'Like ajouté'
            }))
            .catch(error => res.status(400).json({
                error
            }))
    } else if (like === -1) {
        Sauce.updateOne({
                id: req.params.id
            }, {
                $inc: {
                    dislikes: (req.body.like++) - 1
                },
                $push: {
                    usersDisliked: req.body.userId
                }
            })
            .then((sauce) => res.status(200).json({
                message: 'Dislike ajouté'
            }))
            .catch(error => res.status(400).json({
                error
            }))
    } else {
        Sauce.findOne({
                id: req.params.id
            })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({
                            id: req.params.id
                        }, {
                            $pull: {
                                usersLiked: req.body.userId
                            },
                            $inc: {
                                likes: -1
                            }
                        })
                        .then((sauce) => {
                            res.status(200).json({
                                message: 'Like retiré'
                            })
                        })
                        .catch(error => res.status(400).json({
                            error
                        }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({
                            id: req.params.id
                        }, {
                            $pull: {
                                usersDisliked: req.body.userId
                            },
                            $inc: {
                                dislikes: -1
                            }
                        })
                        .then((sauce) => {
                            res.status(200).json({
                                message: 'Dislike retiré'
                            })
                        })
                        .catch(error => res.status(400).json({
                            error
                        }))
                }
            })
            .catch(error => res.status(400).json({
                error
            }))
    }
}