const db = require("../db");
const query = require("../lib/query");
//--------------------------------------------------------------------------------------
module.exports = function (app) {
  // list ngon
  app.get("/ngonngu", async (req, res) => {
    let qr = "SELECT * FROM ngon_ngu ";
    if (req.query.search) qr += `WHERE nn_ten like '%${req.query.search}%'`;
    qr += ' ORDER BY nn_id DESC';
    return res.status(200).send(await query(db, qr));
  });

  // set active ngon ngu
  app.put("/api/ngonngu-active", async (req, res) => {
    const { id, active, arrID } = req.body;
    const qr = `UPDATE ngon_ngu SET active = ? where nn_id = ?`;
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

  // lay ngon ngu theo id
  app.get("/ngonngu/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).send(null);
    return res
      .status(200)
      .send(await query(db, `SELECT * FROM ngon_ngu where nn_id = ?`, id));
  });

  // chinh sua ngon ngu
  app.put("/ngonngu/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    await query(db, `UPDATE ngon_ngu SET ? WHERE nn_id = ?`, [data, id]);
    return res.status(200).send("Cập nhật thành công!");
  });

  // tao ngon nguc
  app.post("/ngonngu/create", async (req, res) => {
    const data = req.body;
    const isExist = query(
      db,
      "SELECT * FROM ngon_ngu where nn_ten = ?",
      data.nn_ten
    );
    if (isExist.length > 0) return res.status(500).send("Tên đã tồn tại");
    await query(db, `INSERT INTO ngon_ngu SET ?`, data);
    return res.status(200).send("Thêm thành công!");
  });

  // xoa ngon ngu
  app.delete("/ngonngu/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(
          async (e) =>
            await query(db, `DELETE FROM ngon_ngu where nn_id = ?`, [e])
        )
      );
    }
    return res.status(201).send("Xóa thành công!");
  });
};
