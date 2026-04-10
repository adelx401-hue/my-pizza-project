const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// الربط بقاعدة البيانات السحابية
mongoose.connect('mongodb+srv://ahmed:Ahmed12345@cluster0.wmqhezu.mongodb.net/myPizzaDB?retryWrites=true&w=majority')
    .then(() => console.log('✅ متصل بقاعدة البيانات السحابية بنجاح'))
    .catch(err => console.log('❌ فشل الاتصال بقاعدة البيانات:', err));

// تعريف البيانات
const OrderSchema = new mongoose.Schema({
    customerName: String,
    items: Array,
    totalPrice: Number,
    status: { type: String, default: 'قيد الانتظار' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// استقبال الطلبات
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order({
            customerName: req.body.name,
            items: req.body.cart,
            totalPrice: req.body.total
        });
        await newOrder.save();
        res.status(201).json({ message: "تم استلام الطلب" });
    } catch (err) {
        res.status(400).json({ error: "خطأ" });
    }
});

// عرض الطلبات للمدير
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "خطأ" });
    }
});

// الصفحات
app.get('/admin', (req, res) => { res.sendFile(__dirname + '/admin.html'); });
app.get('/', (req, res) => { res.sendFile(__dirname + '/index.html'); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 السيرفر يعمل على ${PORT}`); });
