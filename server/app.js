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

app.get('/store', async (req, res)=>{
    let _cuahang = await query(db, "SELECT * FROM cua_hang");
    return res.status(200). send(_cuahang[0]);
});

app.post("/store", async (req, res) => {
    const _data = req.body;
    await query(db, "INSERT INTO cua_hang SET ?", _data);
    return res.status(200).send("Them thanh cong")

});

app.put('/store/:id', async (req, res)=>{
    const {id} = req.params;
    const _data = req.body;
    await query(db, "UPDATE cua_hang SET ? WHERE id = ?", [_data, id]);
    return res.status(200).send("Cập nhật thành công")
});

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

app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
