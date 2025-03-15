import { Schema, model } from "mongoose"

const BannerSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String },
  status: { type: String, enum: ['Active', 'Draft'], default: 'Draft' }
}, { timestamps: true });

export default  model('Banner', BannerSchema);