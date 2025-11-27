const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String }
  }],
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  payment: {
    method: { type: String, required: true, enum: ['card', 'upi', 'cod'] },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] },
    transactionId: { type: String },
    cardNumber: { type: String },
    cardName: { type: String }
  },
  totals: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String }
}, {
  timestamps: true
});

// Generate unique order ID before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `BIOF${Date.now().toString().slice(-8)}${count.toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

