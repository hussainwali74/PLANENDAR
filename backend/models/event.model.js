const mongo = require("mongoose");
const uniqueValidater = require("mongoose-unique-validator");
const Schema = mongo.Schema;
const eventSchema = mongo.Schema(
  {
    title: { type: String },
    user_id: { type: String },
    date: { type: String },
    time: { type: String },
    description: { type: String },
    privacity: { type: String },
    edited: { type: Boolean, default: false },
    extra_fields: [],
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    invitees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    timestamps: true,
  }
);
eventSchema.plugin(uniqueValidater);
module.exports = mongo.model("Event", eventSchema);
