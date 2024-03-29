const express = require('express');
const router = express.Router();

const passport = require('passport');

const {User} = require('../models/User');

const {checkEditProfileFields} = require('../middleware/authenticate');

/**
 * @description  GET /api/user/users
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 * @access private
 */

router.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
    const users = await User.find({}, 'image email username location').exec();

    if (users) {
        return res.status(200).json(users).end();
    } else {
        return res.status(404).json({error: 'No Users Found'});
    }
});

/**
 * @description PUT /api/user/current
 * @param  {String} id
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 */
router.put(
    '/current',
    [passport.authenticate('jwt', {session: false}), checkEditProfileFields],
    async (req, res) => {
        const updateFields = {};

        for (let key of Object.keys(req.body)) {
            if (req.body[key] !== null) {
                updateFields[key] = req.body[key];
            }
        }

        User.findOneAndUpdate({_id: req.user.id}, {$set: updateFields}, {new: true})
            .select('-password')
            .then((doc) => res.json({success: true, user: doc}))
            .catch((err) => res.json({error: err}));
    }
);

/**
 * @description GET api/user/current
 * @param  {String} id
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 */
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user);
});

/**
 * @description DELETE api/user/current
 * @param  {String} id
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 */
router.delete('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
    /** Delete the user */
    await User.findOneAndDelete({_id: req.user.id});

    res.json({success: true});
});

/**
 * @description POST /api/user
 * @body { "userIds": ["user1Id", "user2Id", ...] }
 */
router.post('/users', async (req, res) => {
    try {
        const {userIds} = req.body;

        // Find users by their IDs
        const users = await User.find({_id: {$in: userIds}});

        if (users.length > 0) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({error: 'No users found'});
        }
    } catch (error) {
        return res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/user', async (req, res) => {
    try {
        const { userName } = req.body;

        const users = await User.find({
            $or: [
                { username: { $regex: `^${userName}`, $options: 'i' } },
            ]
        });

        if (users.length > 0) {
            return res.status(200).json(users);
        } else {
            return res.status(404).json({ error: 'No users found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;


