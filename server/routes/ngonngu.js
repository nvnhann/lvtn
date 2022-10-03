const sql = require("../db");

module.exports = function (app) {
  app.get("/ngonngu", async (req, res) => {
    let qr = "SELECT * FROM ngon_ngu ";
    if (req.query.search) {
      qr += `WHERE nn_ten like '%${req.query.search}%'`;
    }
    sql.query(qr, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send(data);
    });
  });

  app.post("/ngonngu/active", async (req, res) => {
    const { id, active } = req.body;
    console.log(req.body);
    if (!id) return res.status(404).send("No content");
    const qr = "UPDATE ngon_ngu SET active = ? where nn_id = ?";
    sql.query(qr, [active, id], (err, _) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công");
    });
  });

  app.get("/ngonngu/:id", async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    if (!id) return res.status(404).send(null);
    const qr = " SELECT * FROM ngon_ngu where nn_id = ?";
    await sql.query(qr, id, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).send(data);
    });
  });

  app.put("/ngonngu/:id/edit", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const qr = "UPDATE ngon_ngu SET ? WHERE nn_id = ?";
    sql.query(qr, [data, id], (err, _) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send("Cập nhật thành công!");
    });
  });

  app.post("/ngonngu/create", async (req, res) => {
    const data = req.body;
    const qr_exist = "SELECT * FROM ngon_ngu where nn_ten = ?";

    await sql.query(qr_exist, data.nn_ten, async (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length !== 0) return res.status(500).send("Tên đã tồn tại");
      const qr = "INSERT INTO ngon_ngu SET ?";
      await sql.query(qr, data);
      return res.status(200).send("Thêm thành công!");
    });
  });

  app.delete("/ngonngu/delete", async (req, res) => {
    if (!!req.body.arrID) {
      const arrID = JSON.parse(req.body.arrID);
      await Promise.all(
        arrID.map(async (e) => {
          let qr = "DELETE FROM ngon_ngu where nn_id = ?";
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
