const db = require("../db");
const query = require("../lib/query");

const multer = require("multer");
const bodyParser = require("body-parser");

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
  app.post("/hoadon", async (req, res) => {
    let data = req.body;
    let product = data.product;
    delete data.product;
    let _qr = `INSERT INTO hoa_don SET ?`;
    let _hoadon = await query(db, _qr, data);

    let _trangthaihoadon = {
      tt_trangthai: 0,
      tt_idhd: _hoadon.insertId,
    };

    let _qr_status = "INSERT INTO trang_thai SET ?";
    await query(db, _qr_status, _trangthaihoadon);
    let _ctht = [];
    let _giabn = [];
    product.map((e) =>
      _ctht.push([
        _hoadon.insertId,
        e.gia_ban,
        e.sp_giakhuyenmai,
        e.sp_soluong,
        e.sp_id,
      ])
    );
    await query(
      db,
      `INSERT INTO chi_tiet_hoa_don (cthd_idhd, cthd_giaban, cthd_giakm, cthd_soluong, cthd_idsp) VALUES ?`,
      [_ctht]
    );
    await Promise.all(
      product.map(
        async (e) =>
          await query(
            db,
            "UPDATE gia_ban SET gb_soluong = gb_soluong - ? WHERE gb_idsp = ?",
            [e.sp_soluong, e.sp_id]
          )
      )
    );
    return res.status(200).send("Thêm thành công đơn hàng!");
  });

  app.get("/hoadon", async (req, res) => {
    let { trangthai, search } = req.query;

    search = search.replaceAll(" ", "%");

    let qr = "SELECT * FROM hoa_don ORDER BY hd_id DESC";

    if (trangthai !== "") {
      qr = `SELECT  * 
                    FROM hoa_don
                    LEFT JOIN trang_thai ON trang_thai.tt_idhd = hoa_don.hd_id,
                    (SELECT tt_idhd, MAX(tt_trangthai) num_tt
                    FROM trang_thai
                    GROUP BY tt_idhd) tt
                    WHERE 
                        trang_thai.tt_trangthai = ${trangthai} AND 
                        tt.tt_idhd = hoa_don.hd_id AND 
                        tt.num_tt = ${trangthai}
                    ORDER BY hd_id DESC`;
      if (!!search) {
        qr = `SELECT hoa_don.*
                    FROM hoa_don
                    LEFT JOIN trang_thai ON trang_thai.tt_idhd = hoa_don.hd_id
                    LEFT JOIN chi_tiet_hoa_don ON chi_tiet_hoa_don.cthd_idhd = hoa_don.hd_id
                    LEFT JOIN san_pham ON san_pham.sp_id = chi_tiet_hoa_don.cthd_idsp,
                    (SELECT tt_idhd, MAX(tt_trangthai) num_tt
                    FROM trang_thai
                    GROUP BY tt_idhd) tt
                    WHERE 
                        trang_thai.tt_trangthai = ${trangthai} AND 
                        tt.tt_idhd = hoa_don.hd_id AND 
                        tt.num_tt = ${trangthai} AND 
                       ( 
                           hoa_don.hd_id LIKE '%${search}%' OR
                           hoa_don.hd_tenkh LIKE '%${search}%' OR
                           hoa_don.hd_diachi LIKE '%${search}%' OR
                           hoa_don.hd_sdt LIKE '%${search}%' OR 
                           hoa_don.hd_email LIKE '%${search}%' OR
                           hoa_don.hd_ngaytao LIKE '%${search}%' OR
                           hoa_don.hd_hinhthucthanhtoan LIKE '%${search}%' OR
                           san_pham.sp_masp LIKE '%${search}%' OR
                           san_pham.sp_ten LIKE '%${search}%' OR 
                           trang_thai.tt_ngaycapnhat LIKE '%${search}%'
                       )
                    GROUP BY hoa_don.hd_id
                    ORDER BY hd_id DESC`;
      }
    } else {
      if (!!search) {
        qr = `SELECT hoa_don.*
                    FROM hoa_don
                    LEFT JOIN chi_tiet_hoa_don ON chi_tiet_hoa_don.cthd_idhd = hoa_don.hd_id
                    LEFT JOIN san_pham ON san_pham.sp_id = chi_tiet_hoa_don.cthd_idsp
                    WHERE 
                       ( 
                           hoa_don.hd_id LIKE '%${search}%' OR
                           hoa_don.hd_tenkh LIKE '%${search}%' OR
                           hoa_don.hd_diachi LIKE '%${search}%' OR
                           hoa_don.hd_sdt LIKE '%${search}%' OR 
                           hoa_don.hd_email LIKE '%${search}%' OR
                           hoa_don.hd_ngaytao LIKE '%${search}%' OR
                           hoa_don.hd_hinhthucthanhtoan LIKE '%${search}%' OR
                           san_pham.sp_masp LIKE '%${search}%' OR
                           san_pham.sp_ten LIKE '%${search}%'
                       )
                   GROUP BY hoa_don.hd_id
                   ORDER BY hoa_don.hd_id DESC`;
      }
    }

    console.log(qr);
    let _hoadon = await query(db, qr);

    if (_hoadon.length) {
      let _cthd =
        "SELECT chi_tiet_hoa_don.*, san_pham.sp_ten, san_pham.sp_masp, ha_max.ha_hinh\n" +
        "FROM `chi_tiet_hoa_don`\n" +
        "LEFT JOIN san_pham ON chi_tiet_hoa_don.cthd_idsp = san_pham.sp_id\n" +
        "LEFT JOIN (SELECT ha_idsp, ha_hinh, MAX(ha_id)  FROM `hinh_anh` GROUP BY ha_idsp) ha_max ON ha_max.ha_idsp = chi_tiet_hoa_don.cthd_idsp\n" +
        "WHERE chi_tiet_hoa_don.cthd_idhd = ?";

      await Promise.all(
        await _hoadon.map(async (e, idx) => {
          _hoadon[idx].trang_thai_all = await query(
            db,
            `SELECT trang_thai.*,users.fullname FROM trang_thai LEFT JOIN users ON users.id = trang_thai.tt_idnv WHERE tt_idhd = ?`,
            e.hd_id
          );

          _hoadon[idx].cthd = await query(db, _cthd, e.hd_id);
          let qr = "SELECT * FROM trang_thai WHERE tt_idhd = ? ";
          _hoadon[idx].trangthai = await query(db, qr, e.hd_id);
        })
      );
    }

    return res.status(200).send(_hoadon);
  });

  app.get("/hoadon/:id", async (req, res) => {
    const { id } = req.params;
    const { trangthai, search } = req.query;

    let qr =
      "SELECT * FROM hoa_don WHERE hoa_don.hd_idkh = ? ORDER BY hd_id DESC";

    if (trangthai !== "") {
      qr = `SELECT  * 
                    FROM hoa_don
                    LEFT JOIN trang_thai ON trang_thai.tt_idhd = hoa_don.hd_id,
                    (SELECT tt_idhd, MAX(tt_trangthai) num_tt
                    FROM trang_thai
                    GROUP BY tt_idhd) tt
                    WHERE 
                        hoa_don.hd_idkh = ? AND 
                        trang_thai.tt_trangthai = ${trangthai} AND 
                        tt.tt_idhd = hoa_don.hd_id AND 
                        tt.num_tt = ${trangthai}
                    ORDER BY hd_id DESC`;
      if (!!search) {
        qr = `SELECT hoa_don.*
                    FROM hoa_don
                    LEFT JOIN trang_thai ON trang_thai.tt_idhd = hoa_don.hd_id
                    LEFT JOIN chi_tiet_hoa_don ON chi_tiet_hoa_don.cthd_idhd = hoa_don.hd_id
                    LEFT JOIN san_pham ON san_pham.sp_id = chi_tiet_hoa_don.cthd_idsp,
                    (SELECT tt_idhd, MAX(tt_trangthai) num_tt
                    FROM trang_thai
                    GROUP BY tt_idhd) tt
                    WHERE 
                        hoa_don.hd_idkh = ? AND 
                        trang_thai.tt_trangthai = ${trangthai} AND 
                        tt.tt_idhd = hoa_don.hd_id AND 
                        tt.num_tt = ${trangthai} AND 
                       ( 
                           hoa_don.hd_id LIKE '%${search}%' OR
                           hoa_don.hd_tenkh LIKE '%${search}%' OR
                           hoa_don.hd_diachi LIKE '%${search}%' OR
                           hoa_don.hd_sdt LIKE '%${search}%' OR 
                           hoa_don.hd_email LIKE '%${search}%' OR
                           hoa_don.hd_ngaytao LIKE '%${search}%' OR
                           hoa_don.hd_hinhthucthanhtoan LIKE '%${search}%' OR
                           san_pham.sp_masp LIKE '%${search}%' OR
                           san_pham.sp_ten LIKE '%${search}%' OR 
                           trang_thai.tt_ngaycapnhat LIKE '%${search}%'
                       )
                    GROUP BY hoa_don.hd_id
                    ORDER BY hd_id DESC`;
      }
    } else {
      if (!!search) {
        qr = `SELECT hoa_don.*
                    FROM hoa_don
                    LEFT JOIN chi_tiet_hoa_don ON chi_tiet_hoa_don.cthd_idhd = hoa_don.hd_id
                    LEFT JOIN san_pham ON san_pham.sp_id = chi_tiet_hoa_don.cthd_idsp
                    WHERE 
                        hoa_don.hd_idkh = ? AND
                       ( 
                           hoa_don.hd_id LIKE '%${search}%' OR
                           hoa_don.hd_tenkh LIKE '%${search}%' OR
                           hoa_don.hd_diachi LIKE '%${search}%' OR
                           hoa_don.hd_sdt LIKE '%${search}%' OR 
                           hoa_don.hd_email LIKE '%${search}%' OR
                           hoa_don.hd_ngaytao LIKE '%${search}%' OR
                           hoa_don.hd_hinhthucthanhtoan LIKE '%${search}%' OR
                           san_pham.sp_masp LIKE '%${search}%' OR
                           san_pham.sp_ten LIKE '%${search}%'
                       )
                   GROUP BY hoa_don.hd_id
                   ORDER BY hoa_don.hd_id DESC`;
      }
    }

    let _hoadon = await query(db, qr, id);

    if (_hoadon.length) {
      let _cthd =
        "SELECT chi_tiet_hoa_don.*, san_pham.sp_ten, san_pham.sp_masp, ha_max.ha_hinh\n" +
        "FROM `chi_tiet_hoa_don`\n" +
        "LEFT JOIN san_pham ON chi_tiet_hoa_don.cthd_idsp = san_pham.sp_id\n" +
        "LEFT JOIN (SELECT ha_idsp, ha_hinh, MAX(ha_id)  FROM `hinh_anh` GROUP BY ha_idsp) ha_max ON ha_max.ha_idsp = chi_tiet_hoa_don.cthd_idsp\n" +
        "WHERE chi_tiet_hoa_don.cthd_idhd = ?";

      await Promise.all(
        await _hoadon.map(async (e, idx) => {
          _hoadon[idx].cthd = await query(db, _cthd, e.hd_id);
          let qr = "SELECT * FROM trang_thai WHERE tt_idhd = ? ";
          _hoadon[idx].trangthai = await query(db, qr, e.hd_id);
        })
      );
    }

    return res.status(200).send(_hoadon);
  });

  app.put("/hoadon/:id", upload.single("hoadon"), async (req, res) => {
    const { id } = req.params;
    let data = {};
    if (req.file) {
      let { _data } = req.body;
      data = JSON.parse(_data);
      data.tt_note = req.file.filename;
    } else {
      data = req.body;
    }

    if (data.tt_trangthai === 1) {
      await query(db, "UPDATE hoa_don SET hd_idnv = ? WHERE hd_id = ?", [
        data.hd_idnv,
        id,
      ]);
      delete data.hd_idnv;
    }

    data.tt_idhd = id;

    const _qr = "INSERT INTO trang_thai SET ?";

    if (data.tt_trangthai === 4) {
      let _listSP = await query(
        db,
        "SELECT cthd_idsp, cthd_soluong FROM `chi_tiet_hoa_don` WHERE cthd_idhd = ?",
        id
      );
      await Promise.all(
        _listSP.map(
          async (e) =>
            await query(
              db,
              "UPDATE gia_ban SET gb_soluong = gb_soluong + ? WHERE gb_idsp = ?",
              [e.cthd_soluong, e.cthd_idsp]
            )
        )
      );
    }

    await query(db, _qr, [data, id]);
    return res.status(200).send("Cập nhật thành công!");
  });
};
