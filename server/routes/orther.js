const db = require("../db");
const query = require("../lib/query");

module.exports = function (app) {

  app.get("/api/role", async (req, res) => {
    let qr = "SELECT * FROM quyen WHERE q_id <> 2";
    return res.status(200).send(await query(db, qr));
  });

  app.get("/store", async (req, res) => {
    let _cuahang = await query(db, "SELECT * FROM cua_hang");
    return res.status(200).send(_cuahang[0]);
  });

  app.post("/store", async (req, res) => {
    const _data = req.body;
    await query(db, "INSERT INTO cua_hang SET ?", _data);
    return res.status(200).send("Them thanh cong");
  });

  app.put("/store/:id", async (req, res) => {
    const { id } = req.params;
    const _data = req.body;
    await query(db, "UPDATE cua_hang SET ? WHERE id = ?", [_data, id]);
    return res.status(200).send("Cập nhật thành công");
  });

  app.get("/danhgiasanpham/:id", async (req, res) => {
    const { id } = req.params;
    let _qr = "";
    if (req.query.type === "chuadanhgia")
      _qr = `
            SELECT san_pham.*,tac_gia.tg_ten,the_loai.tl_ten, san_pham.sp_ten, hoa_don.hd_ngaytao
            FROM hoa_don 
                LEFT JOIN trang_thai ON trang_thai.tt_idhd = hoa_don.hd_id
                LEFT JOIN chi_tiet_hoa_don ON chi_tiet_hoa_don.cthd_idhd = hoa_don.hd_id
                LEFT JOIN san_pham ON san_pham.sp_id = chi_tiet_hoa_don.cthd_idsp
                LEFT JOIN tac_gia ON tac_gia.tg_id = san_pham.sp_idtg
                LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl
            WHERE 
                trang_thai.tt_trangthai = 3 AND
                san_pham.active = 1 AND
                tac_gia.active = 1 AND
                the_loai.active = 1 AND
                san_pham.sp_id NOT IN (SELECT bl_idsp FROM binh_luan WHERE bl_idkh = ? ) AND
                hoa_don.hd_idkh = ?
    `;
    else
      _qr = `
            SELECT san_pham.*,tac_gia.tg_ten,the_loai.tl_ten, san_pham.sp_ten,binh_luan.*
            FROM binh_luan
            \tLEFT JOIN san_pham ON binh_luan.bl_idsp = san_pham.sp_id
                LEFT JOIN tac_gia ON tac_gia.tg_id = san_pham.sp_idtg
                LEFT JOIN the_loai ON the_loai.tl_id = san_pham.sp_idtl
            WHERE 
                san_pham.active = 1 AND
                tac_gia.active = 1 AND
                the_loai.active = 1 AND
                san_pham.sp_id IN (SELECT bl_idsp FROM binh_luan WHERE bl_idkh = ?) AND
                binh_luan.bl_idkh = ?
    `;
    let _books = await query(db, _qr, [id, id]);
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

  app.post("/danhgiasanpham", async (req, res) => {
    let _data = req.body;
    await query(db, "INSERT INTO binh_luan SET ?", _data);
    return res.status(200).send("ok");
  });

  app.get("/binhluan/:id", async (req, res) => {
    let { id } = req.params;
    const { pageURL, starr } = req.query;
    let limit = 5;
    if (pageURL) {
      limit = limit * pageURL;
    }
    let _rs = {};
    let _qr = `SELECT * FROM binh_luan LEFT JOIN users ON binh_luan.bl_idkh = users.id 
    WHERE bl_idsp = ? `;
    if (Number(star) !== 0) _qr += `AND bl_danhgia = ${star} `;
    _qr += "LIMIT ?";
    console.log(_qr);
    _rs.data = await query(db, _qr, [id, limit]);
    _rs.rating = await query(
      db,
      ` SELECT binh_luan.bl_danhgia rate, COUNT(binh_luan.bl_trangthai) num
                                          FROM binh_luan 
                                          WHERE bl_idsp = ? 
                                          GROUP BY binh_luan.bl_danhgia
                                          ORDER BY binh_luan.bl_danhgia DESC`,
      id
    );
    return res.status(200).send(_rs);
  });
  app.get("/thongke", async (req, res) => {
    let _result = {};
    const { year } = req.query;

    const _thongkes = query(db, `call thongke_theokhoangtg_thuchi(NULL, NULL)`);
    let numYears = await query(
      db,
      `SELECT YEAR(hd_ngaytao) nam FROM hoa_don GROUP BY YEAR(hd_ngaytao) ORDER BY nam DESC`
    );
    console.log(
      `CALL thongke_1nam_temp(${
        !!year ? year : numYears[numYears.length - 1].nam
      })`
    );
    let _theo_nam = await query(
      db,
      `CALL thongke_1nam_temp(${!!year ? year : numYears[0].nam})`
    );
    let theonam = [
      {
        name: "nhap",
        data: [],
      },
      {
        name: "ban",
        data: [],
      },
    ];
    _theo_nam[0].map((e) => {
      theonam[0].data.push(e.nhap_vao);
      theonam[1].data.push(e.ban_ra);
    });
    for (let i = 0; i < 12; i++) {
      if (!theonam[0].data[i]) theonam[0].data[i] = 0;
      if (!theonam[1].data[i]) theonam[1].data[i] = 0;
    }
    _result.thongke = _thongkes;
    _result.theo_nam = theonam;
    _result.num_year = numYears;

    return res.status(200).send(_result);
  });
};
