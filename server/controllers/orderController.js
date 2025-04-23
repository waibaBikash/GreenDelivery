import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sripe from "stripe";

// Place Order COD: /api/order/COD



export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address} = req.body;
    if(!address || items.length === 0){
      return res.json({
        success: false,
        message: "Please add address and items to place order"
      })
    }
    // Calculate Amount Using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + (product.offerPrice * item.quantity);
    }, 0);

    // Add Tax Charges (2%)

    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
     
    });
    return res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}


// Place Order Stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address, amount} = req.body;
    const {origin} = req.headers;
    if(!address || items.length === 0){
      return res.json({
        success: false,
        message: "Invalid data"
      })
    }

    let productData = [];

    // Calculate Amount Using Items
    let totalAmount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        pirce: product.offerPrice,
        quantity: item.quantity
      });
      return (await acc) + (product.offerPrice * item.quantity);
    }
    , 0);
    // Add Tax Charges (2%)
     totalAmount += Math.floor(totalAmount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });


    // Sripre Getway Initialization
    const srripeInstance = sripe(process.env.STRIPE_SECRET_KEY);

    // Create line items for stripe

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "Australian Dollar",
          product_data: {
            name: item.name,
          
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100 ,
        },
        quantity: item.quantity,
      };
    }
    );

    // Create Checkout Session
    const session = await srripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/loader?next=my-orders/${order._id}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}

// Get Orders by User ID: /api/order/user

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({
      userId,
      $or:[{paymentType: "COD"}, {ispaid: true}]
    }).populate("items.product address").sort({createdAt: -1});
     res.json({
      success: true,
      orders
    });
  } catch (error) {
     res.json({
      success: false,
      message: error.message,
    });
  }
}


// Get All Orders (for seller / admin): /api/order/all

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(
      {$or:[{paymentType: "COD"}, {ispaid: true}]}
    ).populate("items.product address").sort({createdAt: -1});
    res.json({
      success: true,
      orders
    });
  } catch (error) {
     res.json({
      success: false,
      message: error.message,
    });
  }
}