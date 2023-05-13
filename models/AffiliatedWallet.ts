const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AffiliatedWalletSchema = new Schema(
  {
    walletAddress: String,
    affiliatedBy: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("affiliatedWallets", AffiliatedWalletSchema);
