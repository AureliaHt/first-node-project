// IMPORTS
const router = require('express').Router();
const postController = require('../controllers/post.controller');

// POSTS ROUTES
router.get('/', postController.readPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.patch('/like-post/:id', postController.likePost);
router.patch('/unlike-post/:id', postController.unlikePost);

// COMMENTS ROUTES
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editComment);
router.patch('/delete-comment-post/:id', postController.deleteComment);

// EXPORTS
module.exports = router;