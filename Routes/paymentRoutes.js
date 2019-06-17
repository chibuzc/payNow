require("../models/beneficiary");
const axios = require("axios");
const { PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY } = require("../config/keys");
const crypto = require("crypto");
const Beneficiary = require("../models/beneficiary");

module.exports = app => {
  app.get("/api/paystack/banks", async (req, res) => {
    const URL = "https://api.paystack.co/bank";
    req.headers["Authorization"] = PAYSTACK_SECRET_KEY;
    try {
      const result = await axios({
        method: "get",
        url: URL,
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      });
      
      res.send(result.data.data);
    } catch (error) {
      const { message, status } = error.response;
      console.log("response", message);
      console.log("status", status);
      res.status(status).send({ error: "Something went wrong" });
    }
  });

  app.post("/api/paystack/verifyAccount", async (req, res) => {
    const accountNumber = req.body.accountNumber;
    const bankCode = req.body.bankCode;

    const URL = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;

    try {
      const verification = await axios({
        method: "get",
        url: URL,
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      });

      console.log(`result`, verification.data.data);
      res.send(verification.data.data);
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/api/paystack/transferReciept", async (req, res) => {
    console.log(`saveBeneficiary body body`, req.body);
    let data = {
      account_number: req.body.accountNumber,
      bank_code: req.body.bankCode
    };
    let config = {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    };
    try {
      console.log(`data`, data);
      const reciept = await axios.post(
        "https://api.paystack.co/transferrecipient",
        data,
        config
      );

      console.log(`reciept`, reciept.data);

      console.log(`here`, req.body.accountName);
      if (req.body.saveBeneficiary) {
        const existingBeneficiary = await Beneficiary.findOne({
          transferReciept: reciept.data.data.recipient_code
        });
        if (!existingBeneficiary) {
          const beneficiary = new Beneficiary({
            name: req.body.accountName,
            transferReciept: reciept.data.data.recipient_code,
            bank: reciept.data.data.details.bank_name,
            accountNumber: reciept.data.data.details.account_number
          });
          console.log("bene", beneficiary);
          await beneficiary.save();
          console.log("done here");
          res.send(reciept.data);
          return;
        }
        res.send(reciept.data);
        return;
      }
      res.send(reciept.data);
      return;
    } catch (e) {
      console.log(`error`, e);
    }
  });

  app.post("/api/paystack/initializeTransfer", async (req, res) => {
    console.log(req.body);
    let config = {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    };
    let data = {
      source: "balance",
      reason: req.body.description,
      amount: req.body.amount,
      recipient: req.body.transferReciept.recipient_code
    };
    console.log(`data beign sent`, data);
    try {
      const payment = await axios.post(
        "https://api.paystack.co/transfer",
        data,
        config
      );
      console.log(`payment.data `, payment.data);
      res.send(payment.data);
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/api/paystack/bulk_transfer", async (req, res) => {
    console.log(`boldy for bulk`, req.body);
    let config = {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    };

    const transactionDetails = req.body.map(t => {
      return {
        amount: t.amount,
        recipient: t.transferReciept.recipient_code
      };
    });

    console.log(`transaction Details `, transactionDetails);

    let data = {
      source: "balance",
      reason: req.body.description,
      transfers: transactionDetails
    };

    try {
      const payment = await axios.post(
        "https://api.paystack.co/transfer",
        data,
        config
      );
      console.log(`bulk payment.data `, payment.data);
      res.send(payment.data);
    } catch (error) {
      console.log(error);
      res.send({ error: "Something went wrong" });
    }
  });

  app.get("/api/paystack/allTransfers", async (req, res) => {
    try {
      const URL = "https://api.paystack.co/transfer";
      const transfers = await axios({
        method: "get",
        url: URL,
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      });
      if (transfers.data.data) {
        transfers.data.data = transfers.data.data.slice(0, 5);
        const resolveName = transfers.data.data.map(transfer => {
          const accountNumber = transfer.recipient.details.account_number;
          const bankCode = transfer.recipient.details.bank_code;
          const URL = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;

          const verification = axios({
            method: "get",
            url: URL,
            headers: {
              Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
          });

          return verification;
        });
        const data = await Promise.all(resolveName);
        const requiredData = data.map(d => d.data.data);
        console.log(`requiredData`, requiredData[0]);
        console.log(`transfers`, transfers.data.data[0].recipient.details);

        const finalResult = [];
        transfers.data.data.forEach(t => {
          //  console.log(`t`, t)
          const found = requiredData.find(r => {
            console.log(t.recipient.details.account_number, r.account_number);
            return t.recipient.details.account_number === r.account_number;
          });
          if (found) {
            finalResult.push({
              ...t,
              account_name: found.account_name
            });
          }
        });
        console.log(`final resultsss`, finalResult);
        res.send(finalResult);
      }
    } catch (error) {
      console.log(error);
    }
  });

  app.get("/api/test", async (req, res) => {
    const URL = `https://api.paystack.co/bank/resolve?account_number=0719765463&bank_code=044`;
    console.log(URL);
    try {
      const verification = await axios({
        method: "get",
        url: URL,
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      });
      console.log("headerss", req.headers);
      console.log(`result`, verification);
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/api/paystack/testEndpoint", function(req, res) {
    //validate event
    var hash = crypto
      .createHmac("sha512", `Bearer ${PAYSTACK_SECRET_KEY}`)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      // Retrieve the request's body
      var event = req.body;
      console.log(`event`, event);
      // Go to the DB, find this tansaction, and update it to paid
    }
    res.send(200);
  });
};
