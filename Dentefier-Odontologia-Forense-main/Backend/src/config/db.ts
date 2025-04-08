import mongoose from 'mongoose';

const dbURI: string = 'mongodb://localhost:27017/odontoLegal';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB', error);
    process.exit(1);
  }
};
