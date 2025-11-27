const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: orderId,
      notes: {
        orderId: orderId
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    // Update order with Razorpay order ID
    await Order.findOneAndUpdate(
      { orderId: orderId },
      { razorpayOrderId: razorpayOrder.id }
    );
    
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
      .update(text)
      .digest('hex');
    
    if (generatedSignature === razorpay_signature) {
      // Payment verified successfully
      const order = await Order.findOneAndUpdate(
        { orderId: orderId },
        {
          'payment.status': 'completed',
          'payment.transactionId': razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'confirmed'
        },
        { new: true }
      );
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        order: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
});

// For Cash on Delivery orders
router.post('/cod-confirm', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      {
        'payment.status': 'completed',
        status: 'confirmed'
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'COD order confirmed',
      order: order
    });
  } catch (error) {
    console.error('Error confirming COD order:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming order',
      error: error.message
    });
  }
});

module.exports = router;

