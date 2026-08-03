import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error("Erro: A variável de ambiente MONGO_URI não está definida.");
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar com o MongoDB:", error);
    // Encerra o processo com falha
    process.exit(1);
  }
};

export default connectDB;