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

let upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
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
    WHERE sp_id = ?;
    `;
    const _books = await query(db, qr, id);
    _hinhanh = await query(db, "SELECT * FROM hinh_anh WHERE ha_idsp = ?", id);
    if (_books.length > 0) _books[0].sp_hinhanh = _hinhanh;
    res.status(200).send(_books[0]);
  });

  app.put("/book/:id", upload.array("sp_hinhanh", 10), async (req, res) => {
    const id = req.params.id;
    upload.array("sp_hinhanh", 10);
    console.log(req.files);
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
};
