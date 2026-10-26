import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import genToken from '../utils/genToken.js'
const cookieOptions = {
    httpOnly: true
}
export const registerCustomer = async (req, res) => {
    try {
        const {fullName, email, password, phone} = req.body
        if (!fullName?.trim() || !email?.trim() || !password?.trim() || !phone?.trim()) {
            return res.status(400).json({ message: 'All fields must not be left blank!' })
        }
        const user = await Customer.findOne({ email });
        // Validated email
        if (user) {
            return res.status(400).json({ message: 'E-mail is already in use!' });
        }
        // Validated password
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters in length' });
        }
        const phoneRegex = /^\d+$/
        // Validated phone
        if (!(phoneRegex.test(phone)) || phone.length !== 10) {
            return res.status(400).json({ message: 'Invalid phone number!' })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newCustomer = await Customer.create({fullName: fullName.trim(), email: email.trim(), password: hashedPassword, phone: phone});
        const token = genToken(newCustomer._id)
        res.cookie('token', token, cookieOptions);
        return res.status(200).send(newCustomer);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Internal server error'});
    }
}

export const loginCustomer = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(422).json({message: 'All fields required!'});
        }
        const customer = await Customer.findOne({email});
        if (!customer) {
            return res.status(401).json({message: 'Customer not found!'});
        }
        const correctPassword = await bcrypt.compare(password, customer.password)
        if (!correctPassword) {
            return res.status(401).json({message: 'Customer not found!'});
        }
        const token = genToken(customer._id);
        res.cookie('token', token, cookieOptions);
        return res.status(200).json({success: true, message: 'Login successful'});
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }

}


export const getCustomer = (req, res) => {
    res.status(200).json(req.customer);
}


// Logout
export const logoutCustomer = (req, res) => {
    try {
        res.clearCookie('token', cookieOptions);
        return res.status(200).json({success: true, message: 'Logged out successfully'})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Internal server error'});
    }
}