import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Wishlist from './pages/Wishlist.jsx'
import Products from './pages/Products.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='/register' element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/products' element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path='/products/:id' element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path='/cart' element={<ProtectedRoute><CartPage /></ProtectedRoute>}></Route>
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage/></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path = '/orders' element = {<ProtectedRoute><MyOrdersPage/></ProtectedRoute>}/>
          <Route path="/orders/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>)
}

export default App;