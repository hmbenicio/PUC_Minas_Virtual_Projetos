import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';

dotenv.config();

// =================================================================
// DADOS DO ADMINISTRADOR (EDITE AQUI)
// =================================================================
const ADMIN_DATA = {
  nome: "Administrador2",
  email: "admin2@loja.com", 
  cpf: "000.001.000-00",        
  telefone: "11999999999",
  senha: "AlfaStore@123", 
  role: "admin", 
  endereco: {
    rua: "Rua do Servidor",
    numero: "1",
    cidade: "BH",
    estado: "MG",
    cep: "00000-000"
  },
  consentimentoDados: {
    termosDeUso: true,
    politicaDePrivacidade: true
  }
};

const createAdminUser = async () => {
  try {
    // 1. Conexão com o Banco
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI não definida no arquivo .env");
    }
    
    console.log("🔌 Conectando ao MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado!");

    // 2. Verifica se o usuário já existe
    const userExists = await User.findOne({ email: ADMIN_DATA.email });

    if (userExists) {
      console.log("⚠️  O usuário administrador já existe no banco de dados.");
      if (userExists.role !== 'admin') {
         console.log("🔄 O usuário existe mas não era admin. Atualizando para admin...");
         userExists.role = 'admin';
         await userExists.save();
         console.log("✅ Usuário promovido a admin com sucesso.");
      }
    } else {
      // 3. Cria o novo usuário
      console.log("🔨 Criando novo administrador...");
      
      // Instanciamos o Model. O 'pre-save' hook do Mongoose vai hashear a senha.
      const newAdmin = new User(ADMIN_DATA);
      
      // Forçamos o tipo para 'any' aqui apenas para contornar a tipagem estrita do TS 
      // no campo 'role', caso o enum esteja restrito no seu editor, mas o Mongoose aceitará.
      await newAdmin.save();

      console.log("🎉 Administrador criado com sucesso!");
      console.log(`📧 Email: ${ADMIN_DATA.email}`);
      console.log(`🔑 Senha: ${ADMIN_DATA.senha}`);
    }

  } catch (error) {
    console.error("❌ Erro ao criar administrador:", error);
  } finally {
    // 4. Fecha a conexão
    await mongoose.connection.close();
    console.log("👋 Conexão encerrada.");
    process.exit(0);
  }
};

createAdminUser();