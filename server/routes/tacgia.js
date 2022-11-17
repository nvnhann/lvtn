const db = require("../db");
const query = require("../lib/query");

//----------------------------------------------------------------------

module.exports = function (app) {
  // lay danh sach tac gia admin
  app.get("/tacgia", async (req, res) => {
    let qr = "SELECT * FROM tac_gia ";
    if (req.query.search) qr += `WHERE tg_ten like '%${req.query.search}%'`;
    qr += ' ORDER BY tg_id'
    return res.status(200).send(await query(db, qr));
  });

  // lay danh sach tac gia active
  app.get("/api/tacgia", async (req, res) => {
    let limit = 120;
    const { pageURL } = req.query;
    if (pageURL) limit = limit * pageURL;
    return res
      .status(200)
      .send(
        await query(
          db,
          `SELECT * FROM tac_gia WHERE active = 1 ORDER BY tg_ten  LIMIT ?`,
          limit
        )
      );
  });

  // Dat trang thai tac gia
  app.put("/api/tacgia-active", async (req, res) => {
    const { id, active, arrID } = req.body;
    const qr = `UPDATE tac_gia SET active = ? where tg_id = ?`;
    if (!!arrID) {
      let _arrID = JSON.parse(arrID);
      await Promise.all(
        _arrID.map(async (el) => await query(db, qr, [active, el]))
      );
    } else {
      await query(db, qr, [active, id]);
    }
    return res.status(200).send("Cập nhật thành công");
  });

  // lay tac gia theo id
  app.get("/tacgia/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).send(null);
    return res
      .status(200)
      .send(await query(db, `SELECT * FROM tac_gia where tg_id = ?`, id));
  });

  // chinh sua tac gia theo id
  app.put("/tacgia/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    await query(db, `UPDATE tac_gia SET ? WHERE tg_id = ?`, [data, id]);
    return res.status(200).send("Cập nhật thành công!");
  });

  //them tac gia
  app.post("/tacgia/create", async (req, res) => {
    const data = req.body;
    const isExist = await query(
      db,
      "SELECT * FROM tac_gia where tg_ten = ?",
      data.tg_ten
    );
    if (isExist.length > 0) return res.status(500).send("Tên đã tồn tại");
    await query(db, `INSERT INTO tac_gia SET ?`, data);
    return res.status(200).send("Thêm thành công!");
  });

  //xoa tac gia
  app.delete("/tacgia/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(
          async (e) =>
            await query(db, `DELETE FROM tac_gia where tg_id = ?`, [e])
        )
      );
      return res.status(201).send("Xóa thành công!");
    }
  });
};
