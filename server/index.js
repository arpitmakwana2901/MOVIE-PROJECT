const express = require("express");
const connection = require("./config/db");
const userRoute = require("./routes/userRoute");
const cors = require("cors");
const addShowRoute = require("./routes/addShowRoute");
const buyTicketRoute = require("./routes/buyTicketRoute");
const seatLayoutRoutes = require("./routes/seatLayoutRoute");
const seatBookingRoute = require("./routes/seatBookingRoute");
const bookingRoute = require("./routes/bookingRoute");
const checkoutRoute = require("./routes/checkoutRoute");
const paynowRoute = require("./routes/paynowRoute");
const homepageRouter = require("./routes/homepageRoute");
const FeaturedSectionRoute = require("./routes/FeaturedSectionRoute");
const adminSidebarRoute = require("./routes/adminSidebarRoute");
const dashboardRoute = require("./routes/adminDashboardRoute");
const app = express();
require("dotenv").config()

// app.set("view engine","ejs")

// app.get("/",(req,res)=>{
//     res.render("home")
// })

app.use(cors());
app.use(express.json());

app.use("/user", userRoute);
app.use("/shows", addShowRoute);
app.use("/buy-ticket", buyTicketRoute);
app.use("/book-ticket", bookingRoute);
app.use("/seat-layout", seatLayoutRoutes);
app.use("/seat-booking", seatBookingRoute);
app.use("/checkout", checkoutRoute);
app.use("/payments", paynowRoute);
app.use("/homepage", homepageRouter);
app.use("/featuredSection", FeaturedSectionRoute);
app.use("/adminSidebar", adminSidebarRoute);
app.use("/adminDashboard", dashboardRoute);
app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log("Server is not connected", error.message);
    return;
  }
  connection();
  console.log("server is connected", process.env.PORT);
});
