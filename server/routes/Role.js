const sql = require("../db");

module.exports = function (app) {
  app.get("/role", async (req, res) => {
    let qr = "SELECT * FROM quyen ";
    if (req.query.search) {
      qr += `WHERE q_ten like '%${req.query.search}%' or q_vaitro like '%${req.query.search}%' or q_mota like '%${req.query.search}%'`;
    }
    sql.query(qr, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send(data);
    });
  });

  app.post("/role/active", async (req, res) => {
    const { id, active } = req.body;
    console.log(req.body);
    if (!id) return res.status(404).send("No content");
    const qr = "UPDATE quyen SET active = ? where q_id = ?";
    sql.query(qr, [active, id], (err, _) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công");
    });
  });

  app.get("/role/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).send(null);
    const qr = " SELECT * FROM quyen where q_id = ?";
    await sql.query(qr, id, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });

  app.put("/role/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const qr = "UPDATE quyen SET ? WHERE q_id = ?";
    sql.query(qr, [data, id], (err, _) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công!");
    });
  });

  app.post("/role/create", async (req, res) => {
    const data = req.body;
    const qr_exist = "SELECT * FROM quyen where q_ten = ?";

    await sql.query(qr_exist, data.q_ten, async (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length !== 0) return res.status(500).send("Tên đã tồn tại");
      const qr = "INSERT INTO quyen SET ?";
      await sql.query(qr, data);
      return res.status(200).send("Thêm thành công!");
    });
  });

  app.delete("/role/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(async (e) => {
          let qr = "DELETE FROM quyen where q_id = ?";
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
