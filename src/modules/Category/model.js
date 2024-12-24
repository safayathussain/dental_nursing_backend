const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    questionsCount: {
      type: Number,
      default: 0,
    },
    blogsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
