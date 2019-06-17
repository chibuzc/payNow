const Beneficiary = require("../models/beneficiary");

module.exports = app => {
  app.get("/api/beneficiary/all", async (req, res) => {
    const beneficiaries = await Beneficiary.find({});
    res.send(beneficiaries);
  });

};
