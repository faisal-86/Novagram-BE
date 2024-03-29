const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');
const isLoggedIn = require('../helper/isLoggedIn');


router.use(express.json());

// Route to submit a book review
router.post('/submit',isLoggedIn, reviewController.submit_review_post);

// Route to get book reviews
// router.get('/book',isLoggedIn, reviewController.book_reviews_get);

// router.get('/book/:bookId', isLoggedIn, reviewController.book_reviews_get);
// Route to get reviews for a specific book
router.get('/book/:bookId', isLoggedIn, reviewController.book_reviews_get);


// Route to update a book review
// router.post('/update',isLoggedIn, reviewController.update_review_post);
router.post('/update/:review', isLoggedIn, reviewController.update_review_post);


// Route to delete a book review
router.post('/delete/:review', isLoggedIn, reviewController.delete_review);

module.exports = router;
