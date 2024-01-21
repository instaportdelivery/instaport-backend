require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const cors = require('cors')
const mongoose = require("mongoose");
const { createServer } = require("http");
const socketIO = require('socket.io');

const app = express();
app.use(cors({
    origin: ["*", "http://localhost:3000", "https://www.instaportdelivery.com", "https://instaportdelivery.com", "http://localhost:5500", "https://instaport-transactions.vercel.app", "https://instaport.vercel.app"]
}))
const port = 1000;
const httpServer = createServer(app);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyparser.json());

//Mongoose Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
    .then(() => console.log("Connected to the db"))
    .catch((err) => console.log(err))

const io = socketIO(httpServer);

//Admin Routes
const AdminRouter = require("./Routes/Admin");
app.use("/admin", AdminRouter);

//User Routes
const UserRouter = require("./Routes/User");
app.use("/user", UserRouter);

//Rider Routes
const RiderRouter = require("./Routes/Rider");
app.use("/rider", RiderRouter);

//City Routes
const CityRouter = require("./Routes/City");
app.use("/city", CityRouter);

//Order Routes
const OrderRoutes = require("./Routes/Order");
app.use("/order", OrderRoutes);

//Price Manipulation
const PriceManipulationRoutes = require("./Routes/PriceManipulation");
app.use("/price", PriceManipulationRoutes);

//Auth Routes
const AuthRoutes = require("./Routes/Auth");
app.use("/auth", AuthRoutes);

//Customer Transaction Routes
const CustomerTransactionRoutes = require("./Routes/CustomerTransaction");
app.use("/customer-transactions", CustomerTransactionRoutes);

//Coupons Routes
const CouponRoutes = require("./Routes/Coupon");
app.use("/coupons", CouponRoutes);

//Delivery Status Routes
const DeliveryStatusRoute = require("./Routes/DeliveryStatus");
app.use("/delivery-status", DeliveryStatusRoute);

//Home Routes
app.get("/", (req, res) => res.send("Server Is On"))
app.post("/authtest", (req, res) => {
    return res.json({
        data: `${req.body.transaction_response}`   
    })
    // return res.redirect(`https://google.com/?data=${req.body.transaction_response}`)
})


httpServer.listen(port, () => {
    console.log(`InstaPort backend listening on port ${port}`);
})


