const Users = require('../models/user');

const getUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

const createUser = async (req, res) => {
    try {
        // Destructure data from the request body
        const { username, email, password, confirmPassword, firstName, lastName, mobile, gender, isAdmin } = req.body;

        // Check if all required fields are provided
        if (!username || !email || !password || !firstName || !lastName || !mobile || !gender || isAdmin === undefined || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        // Create a new user
        const newUser = new Users({
            username,
            email,
            password,
            firstName,
            lastName,
            mobile,
            gender,
            isAdmin: isAdmin === 'true', // Convert to boolean
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json(newUser);  // Change 200 to 201 to reflect successful creation
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const updateFields = {};

        // Not to overwrite the contents of the fields in the database
        if (req.body.username) updateFields.username = req.body.username;
        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.password) updateFields.password = req.body.password;
        if (typeof req.body.isAdmin === "boolean") updateFields.isAdmin = req.body.isAdmin;
        if (req.body.firstName) updateFields.firstName = req.body.firstName;
        if (req.body.lastName) updateFields.lastName = req.body.lastName;
        if (req.body.mobile) updateFields.mobile = req.body.mobile;
        if (req.body.gender) updateFields.gender = req.body.gender;

        const user = await Users.findByIdAndUpdate(userId, updateFields, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);  // Return the updated user object
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Users.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
 