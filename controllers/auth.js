// RESTFUL APIs for registration and authentication
const User = require('../models/User');
const Library = require('../models/Library');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const salt = 10;

// exports.auth_signup_post = (req, res) => {
//     console.log('Signing up new user');
//     let user = new User(req.body);

//     let hash = bcrypt.hashSync(req.body.password, salt);

//     user.password = hash;

//     user.save()
//     .then((newUser) => {
//         // After the user is created, create an empty library for them
//         const library = new Library({
//             "user": newUser._id
//         });
//         library.save()
//         .then(() => {
//             console.log('new library created')
//             res.json({'message': 'user created sucessfully'});
//         })
//     })
//     .catch(err => {
//         console.log('Error signing up new user');
//         console.log(err.message);
//     })
// }


exports.auth_signup_post = (req, res) => {
    console.log('Signing up new user');
    let user = new User(req.body);

    let hash = bcrypt.hashSync(req.body.password, salt);

    user.password = hash;

    user.save()
    .then((newUser) => {
        // After the user is created, create an empty library for them
        const library = new Library({
            "user": newUser._id
        });
        library.save()
        .then(() => {
            console.log('New library created');
            
            // Update the user's library field
            User.findByIdAndUpdate(newUser._id, { $set: { library: library._id } }, { new: true })
                .then((userWithUpdatedLibrary) => {
                    console.log('User with updated library:', userWithUpdatedLibrary);
                    res.json({'message': 'user created successfully'});
                })
                .catch((err) => {
                    console.log('Error updating user with library:', err);
                    res.status(500).json({ message: 'Internal Server Error' });
                });
        })
        .catch((err) => {
            console.log('Error creating library:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
    })
    .catch(err => {
        console.log('Error signing up new user');
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    });
}






exports.auth_signin_post = async (req, res) => {
    let { emailAddress, password } = req.body;
    console.log(`Sign in attempt by ${emailAddress}`);

    try {
        let user = await User.findOne({ emailAddress });

        if (!user) {
            console.log('User not found');
            return res.json({ "message": "Wrong username" }).status(400);
        }

        console.log(user);

        // Password Comparison
        const isMatched = await bcrypt.compareSync(password, user.password);

        if (!isMatched) {
            return res.json({ "message": "Wrong password" }).status(400);
        }

        // Generate JWT
        const payload = {
            user: {
                id: user._id
            }
        }

        jwt.sign(
            payload,
            process.env.SECRET,
            { expiresIn: 36000000 },
            (err, token) => {
                if (err) {
                    console.log('Error generating JWT:', err);
                    return res.json({ "message": "You are not logged in" }).status(400);
                }
                res.json({ token }).status(200)
            }
        )
    } catch (err) {
        console.log('Error in signin process:', err);
        res.json({ "message": "You are not logged in" }).status(400);
    }
}
