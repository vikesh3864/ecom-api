import express from "express"
import { addToCart, userCart,removeProductFromCart, clearCart,decreaseProductQty } from "../Controllers/cart.js"
import {Authenticated} from '../Middlewares/auth.js';
const router = express.Router()
//add to cart
router.post('/add',Authenticated,addToCart)

// get cart
router.get('/user',Authenticated,userCart)

//remove cart
router.delete('/remove/:productId',Authenticated,removeProductFromCart

)
// clear cart

router.delete('/clear',Authenticated,clearCart)
// decrease quantity 
router.post('/--qty',Authenticated,decreaseProductQty)







export default router