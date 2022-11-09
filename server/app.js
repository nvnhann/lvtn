const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const CookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("./lib/googleLogin");
const path = require("path");
global.publicPath = path.resolve("public/images");
const bodyParser = require("body-parser");
const db = require('./db');
const query = require('./lib/query');
//---------------------------------------------------------------------------------------
const app = express();
app.use(morgan("dev"));
app.use(CookieParser());
app.use(express.json());

// cors option
const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};
app.use(cors(corsOptions));

app.use("/public", express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        req.headers.origin,
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Credentials"
    );
    next();
});

app.use(session({secret: "cats", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get(
    "/auth/google",
    passport.authenticate("google", {scope: ["email", "profile"]})
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/auth/login/google",
        failureRedirect: "/auth/google/failure",
    })
);

require("./routes/auth")(app);
require("./routes/Users")(app);
require("./routes/Role")(app);
require("./routes/nhaxuatban")(app);
require("./routes/nhacungcap")(app);
require("./routes/danhmuc")(app);
require("./routes/tacgia")(app);
require("./routes/theloai")(app);
require("./routes/ngonngu")(app);
require("./routes/book")(app);
require("./routes/phieunhap")(app);
require("./routes/khuyenmai")(app);
require("./routes/diachi")(app);
require("./routes/hoadon")(app);
require("./routes/orther")(app);

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}
app.get("/test",async (req, res)=>{
    let hoa_don = await query(db, "SELECT chi_tiet_hoa_don.cthd_idsp idsp, SUM(chi_tiet_hoa_don.cthd_soluong) soluong\n" +
        "FROM chi_tiet_hoa_don \n" +
        "GROUP BY chi_tiet_hoa_don.cthd_idsp");

    let ctpn = await query(db, "SELECT ctpn_idsp idsp, SUM(ctpn_soluong) soluong from chi_tiet_phieu_nhap GROUP BY chi_tiet_phieu_nhap.ctpn_idsp");

    await Promise.all(hoa_don.map(async e=>{
       await ctpn.map(async e1=>{
            if(e1.idsp === e.idsp) {console.log(e,e1)
           await query(db, "UPDATE gia_ban SET gb_soluong = ? - ? WHERE gb_idsp = ?", [e1.soluong, e.soluong, e.idsp])}
        })
    }))
    console.log(ctpn);
   // await Promise.all(hoa_don.map(async e => await query(db, "UPDATE chi_tiet_phieu_nhap SET ctpn_soluong = ? + ? WHERE ctpn_idsp = ?", [e.soluong, randomIntFromInterval(10,50), e.idsp])))
    return res.status(200).send("ok")
})
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
