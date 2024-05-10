const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 5000;
const saltRounds = 10; // Number of salt rounds for bcrypt
app.use(cors());
app.use(express.json());

// Replace with a strong and secure secret key
const secretKey = 'AKLSUEYHRJDMN7363MDJ';

// Replace with your MongoDB URI
const mongoURI = 'mongodb://localhost:27017/seazone';


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
// Define the User schema
const userSchema = new mongoose.Schema({
    tshid: String,
    fullName: String,
    email: String,
    phone: String,
    password: String,
    gender: String,
    dob: String,
    user_type: { type: String, default: 'guest' },
    acc_status: { type: String, default: 'active' },
});

// Create the User model
const UserModel = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// API endpoint for adding a new user
app.post('/api/signup', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const lastUser = await UserModel.findOne().sort({ tshid: -1 }).limit(1);

        let nextId = 1001;
        if (lastUser && lastUser.tshid) {
            const lastId = parseInt(lastUser.tshid.slice(-4));
            nextId = lastId + 1;
        }

        const tshid = `TSH${currentDate}${nextId.toString().padStart(4, '0')}`;

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = new UserModel({ ...req.body, password: hashedPassword, tshid });

        const savedUser = await newUser.save();

        // Do not include tshid in the response
        const responseUser = { ...savedUser.toObject() };

        res.status(201).json(responseUser);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// API endpoint for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user in the user collection
        const user = await UserModel.findOne({ email });

        // Find staff in the staff collection if user is not found
        const staff = await StaffModel.findOne({ email });

        if (user || staff) {
            // Determine which collection the user belongs to
            const loginUser = user || staff;

            // Compare the provided password with the hashed password in the database
            const passwordMatch = await bcrypt.compare(password, loginUser.password);

            if (passwordMatch) {
                // Generate a JWT token
                const token = jwt.sign({ userId: loginUser._id, email: loginUser.email }, secretKey, {
                    expiresIn: '1h', // Token expiration time (adjust as needed)
                });

                // Respond with user data and token
                res.json({
                    token,
                    tshid: loginUser.tshid,
                    fullName: loginUser.fullName,
                    user_type: loginUser.user_type,
                    email: loginUser.email,
                    acc_status: loginUser.acc_status
                });
            } else {
                // Password does not match, respond with an error
                res.status(401).json({ error: 'Invalid email or password' });
            }
        } else {
            // User not found, respond with an error
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Define the message model
const messageSchema = new mongoose.Schema({
    fullName: String, // Replace "name" with "fullName"
    email: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' },
    tshid: String, // Add new field "tshid"
});

const Message = mongoose.model('Message', messageSchema);

// API route to insert data into the "message" collection
app.post('/api/messages', async (req, res) => {
    try {
        const { fullName, email, subject, message, tshid } = req.body; // Update "name" to "fullName"

        // Server-side validation
        const errors = {};

        if (/^\d+$/.test(fullName)) {
            errors.fullName = 'Name should not contain numbers';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Invalid email address';
        }
        if (subject.length > 20) {
            errors.subject = 'Subject should be less than 20 characters';
        }
        if (message.length > 100) {
            errors.message = 'Message should be less than 100 characters';
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        // Create a new message instance
        const newMessage = new Message({ fullName, email, subject, message, tshid });

        // Save data to MongoDB
        const savedData = await newMessage.save();
        console.log('Saved data:', savedData);

        res.json(savedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
    const messageId = req.params.id;

    try {
        await Message.findByIdAndDelete(messageId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Status message
app.put('/api/messages/:id/status', async (req, res) => {
    const messageId = req.params.id;

    try {
        await Message.findByIdAndUpdate(messageId, { status: 'Completed' });
        res.json({ success: true });
    } catch (error) {
        console.error('Error completing message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const User = mongoose.model('User', userSchema);

// API route to fetch only guests
app.get('/api/users/guests', async (req, res) => {
    try {
        const guests = await User.find({ user_type: 'guest' });
        res.json(guests);
    } catch (error) {
        console.error('Error fetching guest users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update user status endpoint
app.put('/api/users/:usersId', async (req, res) => {
    const { usersId } = req.params;  // Use "userId" as the parameter name
    const { acc_status } = req.body;

    try {
        // Find the user by userId and update the acc_status
        const user = await User.findByIdAndUpdate(usersId, { acc_status }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.error('Error updating user status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// Define the Staff schema
const staffSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    joiningDate: String,
    dob: String,
    gender: String,
    designation: String,
    salary: String,
    user_type: { type: String, default: 'staff' },
    tshid: String, // Add the tshid field
});

// Create the Staff model
const StaffModel = mongoose.model('Staff', staffSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API endpoint for adding a new staff member
app.post('/api/addStaff', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const lastStaff = await StaffModel.findOne().sort({ tshid: -1 }).limit(1);

        let nextId = 1001;
        if (lastStaff && lastStaff.tshid) {
            const lastId = parseInt(lastStaff.tshid.slice(-4));
            nextId = lastId + 1;
        }

        const tshid = `TSH${currentDate}${nextId.toString().padStart(4, '0')}`;

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newStaff = new StaffModel({ ...req.body, password: hashedPassword, tshid });

        const savedStaff = await newStaff.save();

        // Do not include password in the response
        const responseStaff = { ...savedStaff.toObject() };
        delete responseStaff.password;

        res.status(201).json(responseStaff);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const Staff = mongoose.model('Staff', staffSchema);

// Middleware for parsing JSON
app.use(bodyParser.json());

// API routes

// Get all staff users
app.get('/api/users/staffs', async (req, res) => {
    try {
        const staffUsers = await Staff.find();
        res.json(staffUsers);
    } catch (error) {
        console.error('Error fetching staff users:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Get all staff members
router.get('/staffs', async (req, res) => {
    try {
        const staffMembers = await Staff.find();
        res.json(staffMembers);
    } catch (error) {
        console.error('Error fetching staff members:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update staff member
app.put('/staffs/:id', async (req, res) => {
    try {
        const staffId = req.params.id;

        // Find and update staff in MongoDB
        const updatedStaff = await Staff.findByIdAndUpdate(
            staffId,
            { $set: req.body }, // Update fields based on request body
            { new: true } // Return the updated document
        );

        if (updatedStaff) {
            res.json({ message: 'Staff updated successfully', data: updatedStaff });
        } else {
            res.status(404).json({ error: `Staff with ID ${staffId} not found` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE request to delete a staff 
app.delete('/staffs/:id', async (req, res) => {
    try {
        const staffId = req.params.id;

        // Find and delete staff in MongoDB
        const deletedStaff = await Staff.findByIdAndDelete(staffId);

        if (deletedStaff) {
            res.json({ message: 'Staff deleted successfully', data: deletedStaff });
        } else {
            res.status(404).json({ error: `Staff with ID ${staffId} not found` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a schema for the "menus" collection
const MenuSchema = new mongoose.Schema({
    photo_url: String,
    item_name: String,
    description: String,
    origin: String,
    category: String,
    sub_category: String,
    meal: String,
    rating: Number,
    price: Number,
});

// Use 'menus' as the collection name
const Menu = mongoose.model('Menu', MenuSchema);

app.use(cors());
app.use(bodyParser.json());

app.post('/api/menu', async (req, res) => {
    try {
        const {
            photo_url,
            item_name,
            description,
            origin,
            category,
            sub_category,
            meal,
            rating,
            price,
        } = req.body;

        const menu = new Menu({
            photo_url,
            item_name,
            description,
            origin,
            category,
            sub_category,
            meal,
            rating,
            price,
        });

        await menu.save();

        res.status(201).json({ message: 'Menu item added successfully' });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//fetch menu
app.get('/api/menu', async (req, res) => {
    try {
        const menus = await Menu.find();
        res.json(menus);
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

// API endpoint to update an item in the "menus" collection
app.put('/api/menu/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        // Find the item by ID
        const menu = await Menu.findById(itemId);

        if (!menu) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Update the item with the request body
        menu.set(req.body);

        // Save the updated item
        await menu.save();

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Api for delete items from menus
app.delete('/menus/:id', async (req, res) => {
    try {
        const menuId = req.params.id;

        // Find and delete staff in MongoDB
        const deletedItem = await Staff.findByIdAndDelete(menuId);

        if (deletedItem) {
            res.json({ message: 'Item deleted successfully', data: deletedItem });
        } else {
            res.status(404).json({ error: `Item with ID ${menuId} not found` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Define Room Schema
const roomSchema = new mongoose.Schema({
    bedType: { type: String, required: true },
    totalRooms: { type: Number, required: true },
    roomType: { type: String, required: true },
    capacity: { type: String, required: true },
    available: { type: Number, required: true },
    description: String,
    photo_url: String,
    photo_url2: String,
    features: [String],
    price: Number
});

const Room = mongoose.model('Room', roomSchema);

app.use(bodyParser.json());

// API Endpoints

// Add Room
app.post('/api/room', async (req, res) => {
    try {
        const roomData = req.body;
        const room = new Room(roomData);
        await room.save();
        res.status(201).json({ message: 'Room added successfully', room });
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ message: 'Failed to add room' });
    }
});

// Update Room
app.put('/api/room/:roomId', async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const updatedRoomData = req.body;

        await Room.findByIdAndUpdate(roomId, updatedRoomData);
        res.status(200).json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Failed to update room' });
    }
});

// Delete Room
app.delete('/api/room/:roomId', async (req, res) => {
    try {
        const roomId = req.params.roomId;
        await Room.findByIdAndDelete(roomId);
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ message: 'Failed to delete room' });
    }
});

// Fetch Rooms
app.get('/api/room', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ rooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Failed to fetch rooms' });
    }
});

// API endpoint to fetch user details based on session-stored Tshid
app.get('/api/users', async (req, res) => {
    const { tshid } = req.query;

    try {
        // Find user based on Tshid
        const user = await User.findOne({ tshid });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to update user details
app.put('/api/users', async (req, res) => {
    const { tshid } = req.query;
    const updatedUserData = req.body;

    try {
        // Find the user in the database based on tshid
        const user = await UserModel.findOne({ tshid });

        if (user) {
            // Update the user details
            const updatedUser = await UserModel.findOneAndUpdate({ tshid }, { $set: updatedUserData }, { new: true });
            res.status(200).json({ message: 'User details updated successfully', updatedUserData: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete user profile based on tshid
app.delete('/api/users/:tshid', async (req, res) => {
    const { tshid } = req.params;

    try {
        // Delete user based on Tshid
        const result = await User.deleteOne({ tshid });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'User profile deleted successfully' });
        } else {
            res.status(404).json({ error: 'User profile not found' });
        }
    } catch (error) {
        console.error('Error deleting user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//api to change password
// Express.js route for changing the user's password
// Assuming these functions are defined for encryption and comparison
const encryptFunction = async (password) => await bcrypt.hash(password, 10);
const compareFunction = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword);

app.put('/api/change-password', async (req, res) => {
    try {
        const { tshid } = req.query;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findOne({ tshid });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isOldPasswordCorrect = await compareFunction(oldPassword, user.password);

        if (!isOldPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid old password' });
        }

        const hashedNewPassword = await encryptFunction(newPassword);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Add Amenities
// Define Amenity model
const Amenity = mongoose.model('Amenity', {
    amenityName: String,
    description: String,
    photo_url1: String,
    photo_url2: String,
    price: Number,
    serviceType: String, // Assuming roomReference is a unique identifier for the room
});

// API endpoint to add amenity
app.post('/api/amenities', async (req, res) => {
    try {
        const amenityData = req.body;

        // Create a new Amenity instance
        const newAmenity = new Amenity({
            amenityName: amenityData.amenityName,
            description: amenityData.description,
            photo_url1: amenityData.photo_url1,
            photo_url2: amenityData.photo_url2,
            price: amenityData.price,
            serviceType: amenityData.serviceType,
        });

        // Save the amenity to the database
        await newAmenity.save();

        res.status(201).json({ message: 'Amenity added successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to update amenity
app.put('/api/amenities/:id', async (req, res) => {
    try {
        const amenityId = req.params.id;
        const updatedAmenityData = req.body;

        await Amenity.findByIdAndUpdate(amenityId, updatedAmenityData);

        res.json({ message: 'Amenity updated successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to delete amenity
app.delete('/api/amenities/:id', async (req, res) => {
    try {
        const amenityId = req.params.id;

        await Amenity.findByIdAndDelete(amenityId);

        res.json({ message: 'Amenity deleted successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to fetch all amenities
app.get('/api/amenities', async (req, res) => {
    try {
        const amenities = await Amenity.find();
        res.json(amenities);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to get room types
app.get('/room/types', async (req, res) => {
    try {
        const roomTypes = await Room.find({}, 'type');
        res.json({ roomTypes: roomTypes.map(room => room.type) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to get room cost based on type
app.get('/room', async (req, res) => {
    const roomType = req.query.type;

    try {
        const room = await Room.findOne({ type: roomType });
        if (!room) {
            res.status(404).json({ error: 'Room type not found' });
            return;
        }

        res.json({ cost: room.cost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define Reservation model
const Reservation = mongoose.model('Reservation', {
    tshid: String,
    name: String,
    aadhar: String,
    email: String,
    phone: String,
    checkInDate: Date,
    checkOutDate: Date,
    roomType: String,
    addedServices: [String],
    totalAmount: Number,
    rid: String,
    paymentStatus: { type: String, default: "Pending" },
    roomNo: Number,
    status: { type: String, default: "Not Booked" },
});

// API endpoint to add reservation
app.post('/api/reservation', async (req, res) => {
    try {
        const reservationData = req.body;

        // Generate rid
        const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const lastFourTshid = reservationData.tshid.slice(-4);
        const lastFourAadhar = reservationData.aadhar.slice(-4);
        const rid = `RID${currentDate}${lastFourTshid}${lastFourAadhar}`;

        // Create a new Reservation instance
        const newReservation = new Reservation({
            tshid: reservationData.tshid,
            name: reservationData.name,
            aadhar: reservationData.aadhar,
            email: reservationData.email,
            phone: reservationData.phone,
            checkInDate: reservationData.checkInDate,
            checkOutDate: reservationData.checkOutDate,
            roomType: reservationData.roomType,
            addedServices: reservationData.addedServices,
            totalAmount: reservationData.totalAmount,
            rid: rid,
            paymentStatus: "Pending",
            roomNo: reservationData.roomNo,
            status: reservationData.status
        });

        // Save the reservation to the database
        await newReservation.save();

        res.status(201).json({ message: 'Reservation added successfully', rid: rid });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const padZero = (num) => (num < 10 ? `0${num}` : num);



// API endpoint to fetch reservation details based on tshid
app.get('/api/reservations', async (req, res) => {
    const { tshid } = req.query;
    try {
        const reservations = await Reservation.find({ tshid });
        if (reservations && reservations.length > 0) {
            res.json(reservations);
        } else {
            res.status(404).json({ error: 'Reservations not found' });
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to fetch all reservations
app.get('/api/allreservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/reservations/month', async (req, res) => {
    const { tshid } = req.query;
    try {
        // Calculate past month and current month date range
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
        const currentYear = currentDate.getFullYear();
        const pastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const pastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Fetch reservations where check-in date is in current or past month
        const reservations = await Reservation.find({
            tshid,
            checkInDate: {
                $gte: new Date(`${pastYear}-${padZero(pastMonth)}-01`),
                $lt: new Date(`${currentYear}-${padZero(currentMonth + 1)}-01`)
            }
        });

        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// api to fetch all reservations
// API endpoint to fetch all reservations
app.get('/api/allreservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH endpoint to update a room by ID
app.patch('/api/room/:roomId', async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const updates = req.body;
        const room = await Room.findByIdAndUpdate(roomId, updates, { new: true });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update room route
app.put('/api/room/:id', async (req, res) => {
    try {
        const roomId = req.params.id;
        const { available } = req.body;

        // Update room with the provided ID
        const updatedRoom = await Room.findByIdAndUpdate(roomId, { available }, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }

        return res.status(200).json(updatedRoom);
    } catch (error) {
        console.error('Error updating room:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Update reservation route
app.put('/api/reservation/:id', async (req, res) => {
    try {
        const reservationId = req.params.id;
        const { roomNo } = req.body;

        // Update reservation with the provided ID
        const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, { roomNo }, { new: true });

        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        return res.status(200).json(updatedReservation);
    } catch (error) {
        console.error('Error updating reservation:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Route to fetch reservations by room type
app.get('/api/chkreservations', async (req, res) => {
    try {
        const { roomType } = req.query; // Extract roomType from query parameters

        // Fetch reservations filtered by roomType
        const reservations = await Reservation.find({ roomType });

        if (reservations.length !== 0) {
            return res.status(404).json({ message: `No reservations found for room type ${roomType}` });
        }

        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations by room type:', error);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// Route to fetch reservations by tshid and pending payment status
app.get('/api/pendingpayment', async (req, res) => {
    try {
        const { tshid } = req.query; // Extract tshid from query parameters

        // Fetch reservations filtered by tshid and paymentStatus
        const reservations = await Reservation.find({ tshid, paymentStatus: 'Pending' });

        if (reservations.length === 0) {
            return res.status(404).json({ message: `No pending reservations found for tshid ${tshid}` });
        }

        res.json(reservations);
    } catch (error) {
        console.error('Error fetching pending reservations by tshid:', error);
        res.status(500).json({ error: 'Failed to fetch pending reservations' });
    }
});

// Define Payment schema
const paymentSchema = new mongoose.Schema({
    tshid: String,
    rid: String,
    amount: Number,
    txnid: String,
    method: String,
});

// Create Payment model
const Payment = mongoose.model('Payment', paymentSchema);

// Middleware for parsing JSON bodies
app.use(express.json());

// API endpoint for handling payment requests
app.post('/api/payments', async (req, res) => {
    try {
        // Extract payment details from request body
        const { tshid, rid, amount, txnid, method } = req.body;

        // Create new Payment document
        const payment = new Payment({
            tshid,
            rid,
            amount,
            txnid,
            method,
        });

        // Save payment to the database
        await payment.save();

        // Send success response
        res.status(201).json({ message: 'Payment successful' });
    } catch (error) {
        // Handle errors
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
