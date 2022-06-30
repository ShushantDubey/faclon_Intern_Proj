const Router = require('express').Router();
const controller = require('../controller/controller')
const { validationResult, check } = require('express-validator');

Router.post(
    '/user', 
    check('email').isEmail(),
    check('name').isLength({ min: 3}),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    },
    controller.createUser
);

Router.patch(
    '/user/:id',
    check('name').isLength({ min: 3}),
    check('email').isEmail(),
    check('id').isMongoId(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    },
    controller.updateUser
);

Router.get(
    '/user/:id',
    check('id').isMongoId(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    },
    controller.getUser
);

Router.delete(
    '/user/:id',
    check('id').isMongoId(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    },
    controller.deleteUser
);


//----------------------------


Router.post(
    '/user/:id/friend',
    check('rId').isMongoId(),
    check('sId').isMongoId(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    },
    controller.sendReq
);

Router.patch(
    '/user/:id/friend',
    check('id').isMongoId(),
    check(' docId ').isMongoId(),
    //should only get two val accepted or rejected
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    },
    controller.statusReq
);

Router.get(
    '/user/:id/friend',
    check('id').isMongoId(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    },
    controller.getFriendList
);

Router.delete(
    '/user/:id/friend',
    check('id').isMongoId(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    },
    controller.userDelete
);


module.exports = Router;