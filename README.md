ShopKart 🛒
ShopKart is a full-stack e-commerce application built using React, Express, Node.js, and MongoDB. It features real-time inventory checks, seamless user authentication, order management, and a full end-to-end integration with the Razorpay Payment Gateway in Test Mode.

🚀 Features
User Authentication & Authorization: Secure cookie-based JWT authentication.

Product Catalog: Real-time search, category filtering, and product details.

Cart & Order Management: Add products to cart, dynamic total calculation, and stock validation before checkout.

Payment Gateway Integration: Integrated with Razorpay (Test Mode) using HMAC SHA-256 signature verification on the backend to prevent payment tampering.

REST API Architecture: Robust REST APIs with structured controllers and routes.

🛠️ Tech Stack
Frontend: React, Vite, Tailwind CSS / CSS Modules

Backend: Node.js, Express.js

Database: MongoDB & Mongoose

Payment Processing: Razorpay SDK & Webhooks/Signature Verification

Environment Management: Dotenv

📂 Project Structure
Plaintext
ShopKart/
├── backend/             # Express server, MongoDB schemas, & payment logic
│   ├── controllers/     # Route handlers (order, product, user)
│   ├── models/          # Mongoose database models
│   ├── routes/          # API endpoint routes
│   ├── index.js         # Backend entry point
│   └── .env             # Server secrets (ignored by Git)
├── client/              # React frontend
│   ├── src/             # Components, pages, & assets
│   ├── index.html       # Entry HTML with Razorpay Checkout script
│   └── package.json
├── .gitignore           # Global Git ignore rules
└── README.md
⚙️ Environment Variables
Create a .env file inside the backend folder and populate it with the following key-value pairs:

Code snippet
PORT=8082
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Razorpay Test Credentials
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
Note: Never commit the .env file to version control! Ensure .env is listed in your .gitignore file.

🚦 Getting Started
1. Prerequisites
Node.js (v18 or higher)

npm or yarn

MongoDB instance (Local or MongoDB Atlas)

2. Installation
Clone the repository:

Bash
git clone https://github.com/CoderThatsLockedIn/ShopKart.git
cd ShopKart
Setup Backend:
Bash
cd backend
npm install
Setup Frontend:
Bash
cd ../client
npm install
3. Running the Application
Start the Backend Server:

Bash
cd backend
npx nodemon index.js
The server will run on http://localhost:8082

Start the Frontend Client:

Bash
cd client
npm run dev
The React app will launch on http://localhost:5173

💳 Payment Flow Architecture
Order Creation (POST /api/orders/create-payment-order):

Validates product availability and stock in MongoDB.

Initializes a native Razorpay order on the backend via the Razorpay SDK.

Returns order_id, amount, and currency to the client.

Checkout Modal:

Frontend invokes window.Razorpay checkout modal using the key_id and order details.

Payment Verification (POST /api/orders/verify-payment):

Receives razorpay_order_id, razorpay_payment_id, and razorpay_signature.

Computes expected HMAC SHA-256 signature using RAZORPAY_KEY_SECRET.

On successful verification, updates the order status in MongoDB and reduces inventory stock.
