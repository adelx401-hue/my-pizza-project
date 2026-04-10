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


    // 1. مسار صفحة المدير (لوحة التحكم)
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// 2. مسار جلب الطلبات من قاعدة البيانات
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); 
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "خطأ في جلب البيانات" });
    }
});

// 3. مسار الصفحة الرئيسية للزبائن
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 4. تشغيل السيرفر (يجب أن يكون في النهاية)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ السيرفر يعمل الآن على المنفذ ${PORT}`);
});
