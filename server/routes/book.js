const db = require("../db");
const multer = require("multer");
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

let upload = multer({ storage: storage });

module.exports = function (app) {
  app.post("/book/create", upload.array("sp_hinhanh", 10), async (req, res) => {
    let { data } = req.body;
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
    // SELECT 
    //     sp_masp, sp_ten, san_pham.active, sp_id, gb_soluong, 
    //     nha_xuat_ban.nxb_ten, the_loai.tl_ten, tac_gia.tg_ten
    // FROM san_pham
    //     LEFT JOIN nha_xuat_ban ON nha_xuat_ban.nxb_id = san_pham.sp_idnxb
    //     LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl
    //     LEFT JOIN tac_gia ON tac_gia.tg_id = san_pham.sp_idtg
    //    LEFT JOIN gia_ban ON gia_ban.gb_idsp = san_pham.sp_id
    let qr = `
    SELECT sp_masp, sp_ten, san_pham.active, sp_id, nhapvao.sl_nhap, banra.sl_ban, gb_soluong, gb_gia
        FROM san_pham LEFT JOIN gia_ban ON gia_ban.gb_idsp = san_pham.sp_id,
            (SELECT ctpn_idsp, SUM(ctpn_soluong) sl_nhap FROM chi_tiet_phieu_nhap
            LEFT JOIN phieu_nhap ON ctpn_idpn = pn_id 
            WHERE pn_active = 1 group by ctpn_idsp) nhapvao,
            (SELECT cthd_idsp, SUM(cthd_soluong) sl_ban FROM chi_tiet_hoa_don 
            LEFT JOIN trang_thai ON cthd_idhd = tt_idhd 
            WHERE tt_trangthai = 3 group by cthd_idsp) banra
        WHERE sp_id = nhapvao.ctpn_idsp AND nhapvao.ctpn_idsp = banra.cthd_idsp
    `;
    if (req.query.search) {
      qr += `WHERE sp_ten like '%${req.query.search}%'`;
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
    const { id } = req.params;
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
    let { data } = req.body;
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
      if (results.length !== data.sp_hinhanh.length) {
        await query(db, "DELETE FROM hinh_anh WHERE ha_idsp = ?", id);
        let values = [];
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

  app.get("/api/books", async (req, res) => {
    const { pageURL } = req.query;
    let limit = 32;
    if (pageURL) {
      limit = limit * pageURL;
    }
    const qr_book = `SELECT 
        sp.sp_ten, sp.sp_id, sp.sp_masp,
        gb.gb_gia + (gb.gb_gia * ch.ch_loinhuanbanhang)/100 gia_ban,km.km_phantramgiam, 
        gb.gb_soluong,
        (
            CASE 
                WHEN km.active = 0 then 0
                WHEN DATE(NOW()) < km.km_ngaybatdau then 0
                WHEN DATE(NOW()) > km.km_ngayketthuc then 0
            ELSE ROUND(((gb.gb_gia + gb.gb_gia * ch.ch_loinhuanbanhang / 100) - (gb.gb_gia + gb.gb_gia *ch.ch_loinhuanbanhang / 100) * (km.km_phantramgiam / 100)),0)            
            END
        ) as sp_giakhuyenmai
         FROM  cua_hang ch, san_pham sp
            INNER JOIN chi_tiet_phieu_nhap ON sp_id = ctpn_idsp 
            INNER JOIN phieu_nhap ON ctpn_idpn = pn_id
            LEFT JOIN gia_ban gb ON gb.gb_idsp = sp.sp_id
            LEFT JOIN khuyen_mai km ON km.km_idsp = sp.sp_id
         WHERE 
            sp.active = 1 GROUP BY sp.sp_id LIMIT ?`;
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

  app.get("/api/filterbook", async (req, res) => {
    const { search, type, priceType, priceRange, idtl, idtg } = req.query;
    let qr_book = `SELECT 
        sp.sp_ten, sp.sp_id, sp.sp_masp, tg_ten, tl_ten,
        gb.gb_gia * (1 + ch.ch_loinhuanbanhang/100) gia_ban, km.km_phantramgiam, 
        gb.gb_soluong,
        (
            CASE 
                WHEN km.active = 0 then 0
                WHEN DATE(NOW()) < km.km_ngaybatdau then 0
                WHEN DATE(NOW()) > km.km_ngayketthuc then 0
            ELSE ROUND(((gb.gb_gia + gb.gb_gia * ch.ch_loinhuanbanhang / 100) - (gb.gb_gia + gb.gb_gia *ch.ch_loinhuanbanhang / 100) * (km.km_phantramgiam / 100)),0)            
            END
        ) as sp_giakhuyenmai
         FROM  cua_hang ch, san_pham sp 
            INNER JOIN the_loai ON sp_idtl = tl_id 
            INNER JOIN tac_gia ON sp_idtg = tg_id
            INNER JOIN chi_tiet_phieu_nhap ON sp_id = ctpn_idsp 
            INNER JOIN phieu_nhap ON ctpn_idpn = pn_id
            INNER JOIN gia_ban gb ON gb.gb_idsp = sp.sp_id
            LEFT JOIN khuyen_mai km ON km.km_idsp = sp.sp_id
         WHERE 
            sp.active = 1 `;
    if (!!idtl) {
      qr_book += `AND sp_idtl = ${idtl} `;
    }
    if (!!idtg) {
      qr_book += `AND sp_idtg = ${idtg} `;
    }
    if (!!search && search !== null) {
      qr_book += `AND (sp_ten like '%${search}%' OR sp_masp like '%${search}%' OR tg_ten like '%${search}%' OR tl_ten like '%${search}%') `;
    }
    if (!!priceRange)
      qr_book += `AND (gb.gb_gia * (1 + ch.ch_loinhuanbanhang/100)) >= ${priceRange} `;
    qr_book += "GROUP BY sp_id ";
    if (!!priceType) {
      if (priceType === "Giá cao đến thấp") {
        qr_book += "ORDER BY gb.gb_gia * (1 + ch.ch_loinhuanbanhang/100) DESC";
      } else {
        qr_book += "ORDER BY gb.gb_gia * (1 + ch.ch_loinhuanbanhang/100) ASC";
      }
      if (!!type) {
        if (type === "Mới nhất") {
          qr_book += ", pn_ngaylapphieu DESC";
        } else qr_book += ", pn_ngaylapphieu ASC";
      }
    } else {
      if (!!type) {
        if (type === "Mới nhất") {
          qr_book += "ORDER BY pn_ngaylapphieu DESC";
        } else qr_book += "ORDER BY pn_ngaylapphieu ASC";
      }
    }
    let _books = await query(db, qr_book);
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

  app.get("/api/books/:id", async (req, res) => {
    const { id } = req.params;
    const qr_book = `
            SELECT
                sp.*,  
                tl.tl_ten, 
                tg.tg_ten, 
                nxb.nxb_ten, 
                ncc.ncc_ten, 
                nn.nn_ten,
                gb.gb_gia + (gb.gb_gia * ch.ch_loinhuanbanhang)/100 gia_ban,km.km_phantramgiam, gb.gb_soluong,
                (
                    CASE 
                        WHEN km.active = 0 then 0
                        WHEN DATE(NOW()) < km.km_ngaybatdau then 0
                        WHEN DATE(NOW()) > km.km_ngayketthuc then 0
                    ELSE ROUND(((gb.gb_gia + gb.gb_gia * ch.ch_loinhuanbanhang / 100) - (gb.gb_gia + gb.gb_gia * ch.ch_loinhuanbanhang / 100) * (km.km_phantramgiam / 100)),0)            
                    END
                ) as sp_giakhuyenmai
             FROM  cua_hang ch, san_pham sp
                LEFT JOIN chi_tiet_phieu_nhap ctpn ON sp.sp_id = ctpn.ctpn_idsp
                LEFT JOIN phieu_nhap pn ON ctpn.ctpn_idpn = pn.pn_id
                LEFT JOIN the_loai tl ON tl.tl_id = sp.sp_idtl
                LEFT JOIN tac_gia tg ON tg.tg_id = sp.sp_idtg
                LEFT JOIN nha_xuat_ban nxb ON nxb.nxb_id = sp.sp_idnxb
                LEFT JOIN nha_cung_cap ncc ON ncc.ncc_id = pn.pn_idncc
                LEFT JOIN ngon_ngu nn ON nn.nn_id = sp.sp_idnn
                LEFT JOIN gia_ban gb ON gb.gb_idsp = sp.sp_id
                LEFT JOIN khuyen_mai km ON km.km_idsp = sp.sp_id
             WHERE 
                sp.active = 1 AND 
                ncc.active = 1 AND 
                nxb.active = 1 AND 
                tg.active = 1 AND 
                tl.active = 1 AND 
                sp.sp_id = ?`;
    let _books = await query(db, qr_book, id);
    await Promise.all(
      _books.map(async (book, idx) => {
        _hinhanh = await query(
          db,
          "SELECT ha_hinh FROM hinh_anh WHERE ha_idsp = ? ORDER BY ha_id DESC",
          book.sp_id
        );
        _books[idx].sp_hinhanh = _hinhanh.map(
          (e) => "http://localhost:4000/public/" + e.ha_hinh
        );
      })
    );
    return res.status(200).send(_books);
  });

  app.post("/shopcart", async (req, res) => {
    const { cart } = req.body;

    if (cart.length === 0) return res.status(500).send("Cart empty");
    let qr = `
        SELECT 
        sp.sp_ten, sp.sp_id, sp.sp_masp,
        gb.gb_gia + (gb.gb_gia * ch.ch_loinhuanbanhang)/100 gia_ban,km.km_phantramgiam, 
        gb.gb_soluong,
        (
            CASE 
                WHEN km.active = 0 then 0
                WHEN DATE(NOW()) < km.km_ngaybatdau then 0
                WHEN DATE(NOW()) > km.km_ngayketthuc then 0
            ELSE ROUND(((gb.gb_gia + gb.gb_gia * ch.ch_loinhuanbanhang / 100) - (gb.gb_gia + gb.gb_gia *ch.ch_loinhuanbanhang / 100) * (km.km_phantramgiam / 100)),0)            
            END
        ) as sp_giakhuyenmai
         FROM  cua_hang ch, san_pham sp
            INNER JOIN chi_tiet_phieu_nhap ON sp_id = ctpn_idsp 
            INNER JOIN phieu_nhap ON ctpn_idpn = pn_id
            LEFT JOIN gia_ban gb ON gb.gb_idsp = sp.sp_id
            LEFT JOIN khuyen_mai km ON km.km_idsp = sp.sp_id
         WHERE 
            sp_id IN (?) GROUP BY sp_id`;

    const _books = await query(db, qr, [cart.map((e) => e.id_sp)]);
    await Promise.all(
      _books.map(async (book, idx) => {
        _hinhanh = await query(
          db,
          "SELECT * FROM hinh_anh WHERE ha_idsp = ?",
          book.sp_id
        );
        _books[idx].sp_hinhanh = _hinhanh;
        _books[idx].sp_soluong =
          cart[idx].so_luong > _books[idx].gb_soluong
            ? _books[idx].gb_soluong
            : cart[idx].so_luong;
      })
    );
    return res.status(200).send(_books);
  });
  app.put("/api/book-active", async (req, res) => {
    const { id, active, arrID } = req.body;
    const qr = `UPDATE san_pham SET active = ? where sp_id = ?`;
    if (!!arrID) {
      let _arrID = JSON.parse(arrID);
      await Promise.all(
        _arrID.map(async (el) => await query(db, qr, [active, el]))
      );
    }
    await query(db, qr, [active, id]);
    return res.status(200).send("Cập nhật thành công");
  });
};
