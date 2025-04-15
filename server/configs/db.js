import mongoose from "mongoose";


const connectDB = async () => {
  try {
     mongoose.connection.on('connected', () => console.log('MongoDB connected'));
     await mongoose.connect(`${process.env.MONGODB_URI}/greendelivery`)
  } catch (error) {
     console.error(error.message);
  }
    
}
export default connectDB;