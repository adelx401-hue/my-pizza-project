const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// اتصال تجريبي
mongoose.connect('mongodb://localhost:27017/chefAhmedDB')
    .catch(err => console.log("تحذير: السيرفر يعمل بدون قاعدة بيانات حالياً"));

const OrderSchema = new mongoose.Schema({
  customerName: String,
  items: Array,
  totalPrice: Number,
  status: { type: String, default: 'قيد الانتظار' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order({
            customerName: req.body.name,
            items: req.body.cart,
            totalPrice: req.body.total
        });
        console.log("وصل طلب جديد من: " + req.body.name);
        res.status(201).json({ message: "تم استلام الطلب" });
    } catch (err) {
        res.status(400).json({ error: "خطأ" });
    }
});

app.get('/api/orders', async (req, res) => {
    res.json([{customerName: "تجربة", status: "يعمل بنجاح"}]);
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => console.log('✅ السيرفر يعمل الآن على منفذ 3000'));



