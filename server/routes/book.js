const db = require("../db");
const multer = require("multer");
const bodyParser = require("body-parser");
const query = require("../lib/query");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
        );
        cb(null, file.fieldname + "-" + Date.now() + ext);
    },
});

let upload = multer({storage: storage});

module.exports = function (app) {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.post("/book/create", upload.array("sp_hinhanh", 10), async (req, res) => {
        let {data} = req.body;
        data = JSON.parse(data);
        delete data.sp_hinhanh_old;
        const qr_sp = "SELECT * FROM san_pham WHERE sp_masp = ?";
        await db.query(qr_sp, data.sp_masp, async (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length !== 0)
                return res.status(500).send("Mã sản phẩm đã tồn tại");
            else {
                delete data.sp_hinhanh;
                const qr = "INSERT INTO san_pham SET ?";
                let id_sp = "";
                let values = [];

                await db.query(qr, data, async (_, rs) => {
                    id_sp = rs.insertId;
                    if (req.files.length > 0) {
                        const qr_ha = "INSERT INTO hinh_anh(ha_hinh, ha_idsp) VALUES ?";
                        req.files.map((file) => {
                            values.push([file.filename, id_sp]);
                        });
                        await db.query(qr_ha, [values], (err, results) => {
                            if (err) console.log(err);
                        });
                    }
                });

                return res.status(200).send("Thêm thành công");
            }
        });
    });

    app.get("/books", async (req, res) => {
        let qr = `
    SELECT 
        san_pham.*, 
        nha_xuat_ban.nxb_ten, the_loai.tl_ten, tac_gia.tg_ten, ngon_ngu.nn_ten
    FROM san_pham
        LEFT JOIN nha_xuat_ban ON nha_xuat_ban.nxb_id = san_pham.sp_idnxb
        LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl
        LEFT JOIN tac_gia ON tac_gia.tg_id = san_pham.sp_idtg
        LEFT JOIN ngon_ngu ON ngon_ngu.nn_id = san_pham.sp_idnn
    `;
        if (req.query.search) {
            qr += `WHERE tl_ten like '%${req.query.search}%' or 
                  tg_ten like '%${req.query.search}%' or
                  nn_ten like '%${req.query.search}%' or
                  sp_ten like '%${req.query.search}%' or 
                  nxb_ten like '%${req.query.search}%' or 
                  sp_masp like '%${req.query.search}%'
      `;
        }
        const _books = await query(db, qr);
        await Promise.all(
            _books.map(async (book, idx) => {
                _hinhanh = await query(
                    db,
                    "SELECT * FROM hinh_anh WHERE ha_idsp = ?",
                    book.sp_id
                );
                _books[idx].sp_hinhanh = _hinhanh;
            })
        );
        res.status(200).send(_books);
    });

    app.get("/book/theloai", async (req, res) => {
        let qr = `
    SELECT 
        sp_ten, sp_id, sp_masp
    FROM san_pham
        LEFT JOIN nha_xuat_ban ON nha_xuat_ban.nxb_id = san_pham.sp_idnxb
        LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl
        LEFT JOIN tac_gia ON tac_gia.tg_id = san_pham.sp_idtg
        LEFT JOIN ngon_ngu ON ngon_ngu.nn_id = san_pham.sp_idnn
    `;
        if (req.query.search) {
            qr += `WHERE san_pham.sp_idtl = '${req.query.search}'
      `;
        }
        const _books = await query(db, qr);
        res.status(200).send(_books);
    });

    app.get("/book/:id", async (req, res) => {
        const {id} = req.params;
        let qr = `
    SELECT 
        san_pham.*, 
        nha_xuat_ban.nxb_ten, the_loai.tl_ten, tac_gia.tg_ten, ngon_ngu.nn_ten
    FROM san_pham
        LEFT JOIN nha_xuat_ban ON nha_xuat_ban.nxb_id = san_pham.sp_idnxb
        LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl
        LEFT JOIN tac_gia ON tac_gia.tg_id = san_pham.sp_idtg
        LEFT JOIN ngon_ngu ON ngon_ngu.nn_id = san_pham.sp_idnn
    WHERE sp_id = ?;`;
        const _books = await query(db, qr, id);
        _hinhanh = await query(db, "SELECT * FROM hinh_anh WHERE ha_idsp = ?", id);
        if (_books.length > 0) _books[0].sp_hinhanh = _hinhanh;
        res.status(200).send(_books[0]);
    });

    app.put("/book/:id", upload.array("sp_hinhanh", 10), async (req, res) => {
        const id = req.params.id;
        upload.array("sp_hinhanh", 10);
        console.log(req.files);
        let {data} = req.body;
        data = JSON.parse(data);
        if (req.files.length > 0) {
            await query(db, "DELETE FROM hinh_anh WHERE ha_idsp = ?", id);
            const qr_ha = "INSERT INTO hinh_anh(ha_hinh, ha_idsp) VALUES ?";
            let values = [];
            req.files.map((file) => {
                values.push([file.filename, id]);
            });
            await db.query(qr_ha, [values], (err, results) => {
                if (err) console.log(err);
            });
        } else {
            let results = await query(
                db,
                "SELECT * FROM hinh_anh WHERE ha_idsp = ?",
                id
            );
            console.log(results.length, data.sp_hinhanh);
            if (results.length !== data.sp_hinhanh.length) {
                await query(db, "DELETE FROM hinh_anh WHERE ha_idsp = ?", id);
                let values = [];
                console.log(data.sp_hinhanh);
                data.sp_hinhanh.map((e) => {
                    values.push([e.replace("http://localhost:4000/public/", ""), id]);
                });
                const qr_ha1 = "INSERT INTO hinh_anh(ha_hinh, ha_idsp) VALUES ?";
                await db.query(qr_ha1, [values], (err, results) => {
                    if (err) console.log(err);
                });
            }
        }
        delete data.sp_hinhanh;
        delete data.sp_hinhanh_old;
        await db.query(
            "UPDATE san_pham SET ? WHERE sp_id = ?",
            [data, id],
            (err, results) => {
                if (err) console.log(err);
            }
        );
        return res.status(200).send("Cập nhật thành công");
    });

    app.delete("/book/delete", async (req, res) => {
        if (!!req.body.arrID) {
            const arrID = JSON.parse(req.body.arrID);
            await Promise.all(
                arrID.map(async (e) => {
                    let qr_sp = "DELETE FROM san_pham where sp_id = ?";
                    await db.query(qr_sp, [e], (err, _) => {
                        if (err) {
                            console.log(err);
                        }
                    });

                    let qr_ha = "DELETE FROM hinh_anh where ha_idsp = ?";
                    await db.query(qr_ha, [e], (err, _) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                })
            );
            return res.status(201).send("Xóa thành công!");
        }
    });

    app.get('/api/books', async (req, res) => {
        const {pageURL} = req.query;
        let limit = 32;
        if (pageURL) {
            limit = limit * pageURL
        }
        const qr_book = `SELECT sp.*, pn.*, ctpn.*,km.km_phantramgiam,(
            CASE 
            WHEN km.active = 0 then 0
            WHEN DATE(NOW()) < km.km_ngaybatdau then 0
            WHEN DATE(NOW()) > km.km_ngayketthuc then 0
                 ELSE ROUND((ctpn.ctpn_gia - ctpn.ctpn_gia * (km.km_phantramgiam / 100)),0)
            END
        ) as sp_giakhuyenmai
             FROM san_pham sp 
                LEFT JOIN chi_tiet_phieu_nhap ctpn ON sp.sp_id = ctpn.ctpn_idsp
                LEFT JOIN phieu_nhap pn ON ctpn.ctpn_idpn = pn.pn_id
                LEFT JOIN the_loai tl ON tl.tl_id = sp.sp_idtl
                LEFT JOIN danh_muc dm ON dm.dm_id = tl.tl_iddm
                LEFT JOIN tac_gia tg ON tg.tg_id = sp.sp_idtg
                LEFT JOIN nha_xuat_ban nxb ON nxb.nxb_id = sp.sp_idnxb
                LEFT JOIN nha_cung_cap ncc ON ncc.ncc_id = pn.pn_idncc
                LEFT JOIN ngon_ngu nn ON nn.nn_id = sp.sp_idnn
                LEFT JOIN khuyen_mai km ON km.km_idsp = sp.sp_id,
                    ( SELECT ctpn.ctpn_idsp, MIN(pn.pn_ngaylapphieu) ngay_lap_phieu 
                        FROM  chi_tiet_phieu_nhap ctpn LEFT JOIN phieu_nhap pn ON pn.pn_id = ctpn.ctpn_idpn
                        GROUP BY  ctpn.ctpn_idsp) date_min
                        WHERE 
                            ctpn.ctpn_soluong > 0 AND 
                            sp.sp_id = date_min.ctpn_idsp AND 
                            pn.pn_ngaylapphieu = date_min.ngay_lap_phieu AND
                            sp.active = 1 AND ncc.active = 1 AND nxb.active = 1 AND tg.active = 1 AND dm.active = 1 AND tl.active = 1
                            LIMIT ?`;
        let _books = await query(db, qr_book, limit);
        await Promise.all(
            _books.map(async (book, idx) => {
                _hinhanh = await query(
                    db,
                    "SELECT * FROM hinh_anh WHERE ha_idsp = ?",
                    book.sp_id
                );
                _books[idx].sp_hinhanh = _hinhanh;
            })
        );
        return res.status(200).send(_books);
    });

    app.get('/api/books/:id', async (req, res) => {
        const {id} = req.params;
        const {pageURL} = req.query;
        let limit = 32;
        if (pageURL) {
            limit = limit * pageURL
        }
        const qr_book = `SELECT sp.*, pn.*, ctpn.*,km.km_phantramgiam,(
            CASE 
            WHEN km.active = 0 then 0
            WHEN DATE(NOW()) < km.km_ngaybatdau then 0
            WHEN DATE(NOW()) > km.km_ngayketthuc then 0
                 ELSE ROUND((ctpn.ctpn_gia - ctpn.ctpn_gia * (km.km_phantramgiam / 100)),0)
            END
        ) as sp_giakhuyenmai, tl.*, tg.*, nxb.*, ncc.*, nn.*
             FROM san_pham sp 
                LEFT JOIN chi_tiet_phieu_nhap ctpn ON sp.sp_id = ctpn.ctpn_idsp
                LEFT JOIN phieu_nhap pn ON ctpn.ctpn_idpn = pn.pn_id
                LEFT JOIN the_loai tl ON tl.tl_id = sp.sp_idtl
                LEFT JOIN danh_muc dm ON dm.dm_id = tl.tl_iddm
                LEFT JOIN tac_gia tg ON tg.tg_id = sp.sp_idtg
                LEFT JOIN nha_xuat_ban nxb ON nxb.nxb_id = sp.sp_idnxb
                LEFT JOIN nha_cung_cap ncc ON ncc.ncc_id = pn.pn_idncc
                LEFT JOIN ngon_ngu nn ON nn.nn_id = sp.sp_idnn
                LEFT JOIN khuyen_mai km ON km.km_idsp = sp.sp_id,
                    ( SELECT ctpn.ctpn_idsp, MIN(pn.pn_ngaylapphieu) ngay_lap_phieu 
                        FROM  chi_tiet_phieu_nhap ctpn LEFT JOIN phieu_nhap pn ON pn.pn_id = ctpn.ctpn_idpn
                        GROUP BY  ctpn.ctpn_idsp) date_min
                        WHERE 
                            ctpn.ctpn_soluong > 0 AND 
                            sp.sp_id = date_min.ctpn_idsp AND 
                            pn.pn_ngaylapphieu = date_min.ngay_lap_phieu AND
                            sp.active = 1 AND ncc.active = 1 AND nxb.active = 1 AND tg.active = 1 AND dm.active = 1 AND tl.active = 1 AND sp.sp_id = ?
                            LIMIT ?`;
        let _books = await query(db, qr_book, [id, limit]);
        await Promise.all(
            _books.map(async (book, idx) => {
                _hinhanh = await query(
                    db,
                    "SELECT ha_hinh FROM hinh_anh WHERE ha_idsp = ?",
                    book.sp_id
                );

                _books[idx].sp_hinhanh = _hinhanh.map(e => 'http://localhost:4000/public/'+ e.ha_hinh);
            })
        );
        return res.status(200).send(_books);
    });

    app.post('/shopcart', async (req, res) => {
        const {cart} = req.body;
        if (cart.length === 0) return res.status(500).send("Cart empty")
        let qr = `
            SELECT sp.*, pn.*, ctpn.*,km.km_phantramgiam,(
                    CASE 
                    WHEN km.active = 0 then 0
                    WHEN DATE(NOW()) < km.km_ngaybatdau then 0
                    WHEN DATE(NOW()) > km.km_ngayketthuc then 0
                         ELSE ROUND((ctpn.ctpn_gia - ctpn.ctpn_gia * (km.km_phantramgiam / 100)),0)
                    END
                ) as sp_giakhuyenmai
            FROM san_pham sp 
                LEFT JOIN chi_tiet_phieu_nhap ctpn ON sp.sp_id = ctpn.ctpn_idsp
                LEFT JOIN phieu_nhap pn ON ctpn.ctpn_idpn = pn.pn_id
                LEFT JOIN the_loai tl ON tl.tl_id = sp.sp_idtl
                LEFT JOIN danh_muc dm ON dm.dm_id = tl.tl_iddm
                LEFT JOIN tac_gia tg ON tg.tg_id = sp.sp_idtg
                LEFT JOIN nha_xuat_ban nxb ON nxb.nxb_id = sp.sp_idnxb
                LEFT JOIN nha_cung_cap ncc ON ncc.ncc_id = pn.pn_idncc
                LEFT JOIN ngon_ngu nn ON nn.nn_id = sp.sp_idnn
                LEFT JOIN khuyen_mai km ON km.km_idsp = sp.sp_id,
                    ( SELECT ctpn.ctpn_idsp, MIN(pn.pn_ngaylapphieu) ngay_lap_phieu 
                        FROM  chi_tiet_phieu_nhap ctpn LEFT JOIN phieu_nhap pn ON pn.pn_id = ctpn.ctpn_idpn
                        GROUP BY  ctpn.ctpn_idsp) date_min
            WHERE 
                ctpn.ctpn_soluong > 0 AND 
                sp.sp_id = date_min.ctpn_idsp AND 
                pn.pn_ngaylapphieu = date_min.ngay_lap_phieu AND
                sp.active = 1 AND ncc.active = 1 AND nxb.active = 1 AND tg.active = 1 AND dm.active = 1 AND tl.active = 1 AND
                ctpn.ctpn_soluong > 0 AND sp.sp_id = date_min.ctpn_idsp AND pn.pn_ngaylapphieu = date_min.ngay_lap_phieu AND sp.sp_id IN (?);`;
        const _books = await query(db, qr, [cart.map(e => e.id_sp)]);
        await Promise.all(
            _books.map(async (book, idx) => {
                _hinhanh = await query(
                    db,
                    "SELECT * FROM hinh_anh WHERE ha_idsp = ?",
                    book.sp_id
                );
                _books[idx].sp_hinhanh = _hinhanh;
                _books[idx].sp_soluong = cart[idx].so_luong > _books[idx].ctpn_soluong ? _books[idx].ctpn_soluong : cart[idx].so_luong;
            })
        );
        return res.status(200).send(_books);
    })
};
