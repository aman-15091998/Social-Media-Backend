import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
