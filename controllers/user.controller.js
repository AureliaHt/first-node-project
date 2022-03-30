// imports
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req,res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID unknown : ' + err);
    }).select('-password');
}


// MAJ PROFIL
module.exports.updateUser = async (req, res) => {
        if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

        try {
            await UserModel.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        bio: req.body.bio
                    }
                },
                { new: true, 
                  upsert: true, 
                  setDefaultsOnInsert: true
                },
                //(err, docs) => {
                    //if (!err) return res.send(docs);
                    //if (err) return res.status(500).send({ message: err});
                //}
            )
            .then((docs) => res.send(docs))
            .catch((err) => res.status(500).send({ message: err }));
        } 
        catch (err) {
            return res.status(500).json({ message: err});
        }
};


// DELETE PROFIL
module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        await UserModel.remove( {_id: req.params.id}).exec();
        res.status(200).json({ message: "successfully deleted" });
    }
    catch (err) {
        return res.status(500).json({ message: err});
        }
    };


// FOLLOW
module.exports.follow = async (req, res) => {
        if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.params.idToFollow}},
            { new: true, upsert: true },
            //(err, docs) => {
                //if (!err) res.status(201).json(docs);
                //else return res.status(400).json(err);
            //}
        )
        .then((docs) => res.status(201).json(docs))
        .catch((err) => res.status(400).json(err));

        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: {followers: req.params.id}},
            { new: true, upsert: true },
            //(err, docs) => {
            //if (err) return res.status(400).json(err);
            //}
        )
        .then((err) => res.status(400).json(err));
    }
    catch (err) {
        return res.status(500).json({ message: err});
        }
    };


// UNFOLLOW
module.exports.unfollow = async (req, res) => {
        if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        // remove from the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.params.idToUnfollow}},
            { new: true, upsert: true },
            //(err, docs) => {
                //if (!err) res.status(201).json(docs);
                //else return res.status(400).json(err);
            //}
        )
        .then((docs) => res.status(201).json(docs))
        .catch((err) => res.status(400).json(err))
        // remove from the following list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: {followers: req.params.id}},
            { new: true, upsert: true },
            //(err, docs) => {
            //if (err) return res.status(400).json(err);
            //}
        )
        .then((err) => res.status(400).json(err));
    }
    catch (err) {
        return res.status(500).json({ message: err});
        }
    };