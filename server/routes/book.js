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
        nha_xuat_ban.nxb_ten, nha_cung_cap.ncc_ten, the_loai.tl_ten, tac_gia.tg_ten, ngon_ngu.nn_ten
    FROM san_pham
        LEFT JOIN nha_cung_cap ON nha_cung_cap.ncc_id = san_pham.sp_idncc
        LEFT JOIN nha_xuat_ban ON nha_xuat_ban.nxb_id = san_pham.sp_idnxb
        LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl
        LEFT JOIN tac_gia ON tac_gia.tg_id = san_pham.sp_idtg
        LEFT JOIN ngon_ngu ON ngon_ngu.nn_id = san_pham.sp_idnn
    `;
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
        nha_xuat_ban.nxb_ten, nha_cung_cap.ncc_ten, the_loai.tl_ten, tac_gia.tg_ten, ngon_ngu.nn_ten
    FROM san_pham
        LEFT JOIN nha_cung_cap ON nha_cung_cap.ncc_id = san_pham.sp_idncc
        LEFT JOIN nha_xuat_ban ON nha_xuat_ban.nxb_id = san_pham.sp_idnxb
        LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl
        LEFT JOIN tac_gia ON tac_gia.tg_id = san_pham.sp_idtg
        LEFT JOIN ngon_ngu ON ngon_ngu.nn_id = san_pham.sp_idnn
    WHERE sp_id = ?;
    `;
    const _books = await query(db, qr, id);
    _hinhanh = await query(db, "SELECT * FROM hinh_anh WHERE ha_idsp = ?", id);
    _books[0].sp_hinhanh = _hinhanh;
    res.status(200).send(_books[0]);
  });
};
