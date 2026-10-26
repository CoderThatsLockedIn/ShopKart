# ShopKart 🛒

ShopKart is a full-stack e-commerce application built using React, Express, Node.js, and MongoDB. It features real-time inventory checks, seamless user authentication, order management, and a full end-to-end integration with the **Razorpay Payment Gateway** in Test Mode.

---

## 🚀 Features

* **User Authentication & Authorization:** Secure cookie-based JWT authentication.
* **Product Catalog:** Real-time search, category filtering, and product details.
* **Cart & Order Management:** Add products to cart, dynamic total calculation, and stock validation before checkout.
* **Payment Gateway Integration:** Integrated with Razorpay (Test Mode) using HMAC SHA-256 signature verification on the backend to prevent payment tampering.
* **REST API Architecture:** Robust REST APIs with structured controllers and routes.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS / CSS Modules
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose
* **Payment Processing:** Razorpay SDK & Webhooks/Signature Verification
* **Environment Management:** Dotenv

---

## 📂 Project Structure

```text
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
