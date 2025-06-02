const Razorpay = require("razorpay");
const crypto = require("crypto");
const errorHandler = require("../../helpers/errors/errorHandler");
const { Razor_Key_ID, Razor_Secret_Key } = process.env;

const razorpay = new Razorpay({
    key_id: Razor_Key_ID,
    key_secret: Razor_Secret_Key,
});

const CreateOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt#1",
        });
        return res.json({ success: true, order });
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

const verifyOrder = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", Razor_Secret_Key)
            .update(body)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res
                .status(400)
                .json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        return next(new errorHandler("Something went wrong", 500, error));
    }
};

module.exports = { CreateOrder,verifyOrder };
