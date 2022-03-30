// IMPORTS
const router = require('express').Router();
const postController = require('../controllers/post.controller');

// POST
router.get('/', postController.readPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

// EXPORTS
module.exports = router;