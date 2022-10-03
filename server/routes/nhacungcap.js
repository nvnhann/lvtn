const sql = require("../db");

module.exports = function (app) {
  app.get("/nhacungcap", async (req, res) => {
    let qr = "SELECT * FROM nha_cung_cap ";
    if (req.query.search) {
      qr += `WHERE ncc_ten like '%${req.query.search}%' or 
              ncc_sdt like '%${req.query.search}%' or
              ncc_email like '%${req.query.search}%' or
              ncc_diachi like '%${req.query.search}%'`;
    }
    console.log(qr)
    sql.query(qr, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send(data);
    });
  });

  app.post("/nhacungcap/active", async (req, res) => {
    const { id, active } = req.body;
    console.log(req.body);
    if (!id) return res.status(404).send("No content");
    const qr = "UPDATE nha_cung_cap SET active = ? where ncc_id = ?";
    sql.query(qr, [active, id], (err, _) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công");
    });
  });

  app.get("/nhacungcap/:id", async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    if (!id) return res.status(404).send(null);
    const qr = " SELECT * FROM nha_cung_cap where ncc_id = ?";
    await sql.query(qr, id, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });

  app.put("/nhacungcap/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const qr = "UPDATE nha_cung_cap SET ? WHERE ncc_id = ?";
    sql.query(qr, [data, id], (err, _) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công!");
    });
  });

  app.post("/nhacungcap/create", async (req, res) => {
    const data = req.body;
    const qr_exist = "SELECT * FROM nha_cung_cap where ncc_ten = ?";

    await sql.query(qr_exist, data.ncc_ten, async (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length !== 0) return res.status(500).send("Tên đã tồn tại");
      const qr = "INSERT INTO nha_cung_cap SET ?";
      await sql.query(qr, data);
      return res.status(200).send("Thêm thành công!");
    });
  });

  app.delete("/nhacungcap/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(async (e) => {
          let qr = "DELETE FROM nha_cung_cap where ncc_id = ?";
          await sql.query(qr, [e], (err, _) => {
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
