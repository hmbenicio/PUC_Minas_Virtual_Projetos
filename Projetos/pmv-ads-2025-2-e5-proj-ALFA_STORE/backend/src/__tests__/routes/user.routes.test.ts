import request from 'supertest';
import { testApp } from '../testApp';
import User from '../../models/user.model';
import jwt from 'jsonwebtoken';

describe('User Routes', () => {
  // Dados de teste válidos
  const validUserData = {
    nome: 'Usuário Teste',
    email: 'teste@email.com',
    cpf: '123.456.789-00',
    telefone: '11999999999',
    senha: 'Senha@123',
    endereco: {
      rua: 'Rua Teste',
      numero: '123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
    },
    consentimentoDados: {
      termosDeUso: true,
      politicaDePrivacidade: true,
    },
  };

  // ==========================================
  // TESTES DE REGISTRO (POST /api/v1/users)
  // ==========================================
  describe('POST /api/v1/users - Registro de Usuário', () => {
    describe('Cenários de Sucesso', () => {
      it('deve criar um novo usuário com dados válidos', async () => {
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(validUserData)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.email).toBe(validUserData.email);
        expect(response.body.nome).toBe(validUserData.nome);
        expect(response.body.role).toBe('cliente');
        expect(response.body).not.toHaveProperty('senha');
      });

      it('deve converter email para lowercase', async () => {
        const userData = { ...validUserData, email: 'TESTE@EMAIL.COM' };
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(userData)
          .expect(201);

        expect(response.body.email).toBe('teste@email.com');
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 400 para email inválido', async () => {
        const invalidData = { ...validUserData, email: 'email-invalido' };
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(invalidData)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro 400 para CPF inválido', async () => {
        const invalidData = { ...validUserData, cpf: '12345678900' };
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(invalidData)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro 400 para senha fraca', async () => {
        const invalidData = { ...validUserData, senha: '12345678' };
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(invalidData)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro 400 para telefone inválido', async () => {
        const invalidData = { ...validUserData, telefone: '123' };
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(invalidData)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro 400 sem aceitar termos de uso', async () => {
        const invalidData = {
          ...validUserData,
          consentimentoDados: { termosDeUso: false, politicaDePrivacidade: true },
        };
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(invalidData)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro 400 para CEP inválido', async () => {
        const invalidData = {
          ...validUserData,
          endereco: { ...validUserData.endereco, cep: '12345' },
        };
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(invalidData)
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro para email duplicado', async () => {
        // Cria primeiro usuário
        await request(testApp).post('/api/v1/users').send(validUserData);

        // Tenta criar outro com mesmo email
        const duplicateData = { ...validUserData, cpf: '987.654.321-00' };
        const response = await request(testApp)
          .post('/api/v1/users')
          .send(duplicateData);

        expect(response.status).toBeGreaterThanOrEqual(400);
      });
    });
  });

  // ==========================================
  // TESTES DE LOGIN (POST /api/v1/users/login)
  // ==========================================
  describe('POST /api/v1/users/login - Autenticação', () => {
    beforeEach(async () => {
      // Cria um usuário antes de cada teste de login
      await request(testApp).post('/api/v1/users').send(validUserData);
    });

    describe('Cenários de Sucesso', () => {
      it('deve autenticar com credenciais válidas', async () => {
        const response = await request(testApp)
          .post('/api/v1/users/login')
          .send({ email: validUserData.email, senha: validUserData.senha })
          .expect(200);

        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(validUserData.email);
        expect(response.body.user).not.toHaveProperty('senha');
      });

      it('deve retornar um token JWT válido', async () => {
        const response = await request(testApp)
          .post('/api/v1/users/login')
          .send({ email: validUserData.email, senha: validUserData.senha })
          .expect(200);

        const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET!);
        expect(decoded).toHaveProperty('id');
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 401 para senha incorreta', async () => {
        const response = await request(testApp)
          .post('/api/v1/users/login')
          .send({ email: validUserData.email, senha: 'SenhaErrada@123' })
          .expect(401);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro 401 para email inexistente', async () => {
        const response = await request(testApp)
          .post('/api/v1/users/login')
          .send({ email: 'naoexiste@email.com', senha: validUserData.senha })
          .expect(401);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro 400 sem email', async () => {
        const response = await request(testApp)
          .post('/api/v1/users/login')
          .send({ senha: validUserData.senha })
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });

      it('deve retornar erro 400 sem senha', async () => {
        const response = await request(testApp)
          .post('/api/v1/users/login')
          .send({ email: validUserData.email })
          .expect(400);

        expect(response.body).toHaveProperty('message');
      });
    });
  });

  // ==========================================
  // TESTES DE GET USER BY ID
  // ==========================================
  describe('GET /api/v1/users/:id - Buscar Usuário por ID', () => {
    let userToken: string;
    let userId: string;

    beforeEach(async () => {
      // Cria usuário e faz login
      const createResponse = await request(testApp).post('/api/v1/users').send(validUserData);
      userId = createResponse.body._id;

      const loginResponse = await request(testApp)
        .post('/api/v1/users/login')
        .send({ email: validUserData.email, senha: validUserData.senha });
      userToken = loginResponse.body.token;
    });

    describe('Cenários de Sucesso', () => {
      it('deve retornar dados do próprio usuário', async () => {
        const response = await request(testApp)
          .get(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200);

        expect(response.body._id).toBe(userId);
        expect(response.body.email).toBe(validUserData.email);
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 401 sem token', async () => {
        await request(testApp)
          .get(`/api/v1/users/${userId}`)
          .expect(401);
      });

      it('deve retornar erro 401 com token inválido', async () => {
        await request(testApp)
          .get(`/api/v1/users/${userId}`)
          .set('Authorization', 'Bearer token-invalido')
          .expect(401);
      });

      it('deve retornar erro 403 ao tentar acessar outro usuário', async () => {
        // Cria outro usuário
        const otherUserData = {
          ...validUserData,
          email: 'outro@email.com',
          cpf: '987.654.321-00',
        };
        const otherUserResponse = await request(testApp).post('/api/v1/users').send(otherUserData);
        const otherUserId = otherUserResponse.body._id;

        // Tenta acessar dados do outro usuário
        await request(testApp)
          .get(`/api/v1/users/${otherUserId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });
    });
  });

  // ==========================================
  // TESTES DE UPDATE USER
  // ==========================================
  describe('PUT /api/v1/users/:id - Atualizar Usuário', () => {
    let userToken: string;
    let userId: string;

    beforeEach(async () => {
      const createResponse = await request(testApp).post('/api/v1/users').send(validUserData);
      userId = createResponse.body._id;

      const loginResponse = await request(testApp)
        .post('/api/v1/users/login')
        .send({ email: validUserData.email, senha: validUserData.senha });
      userToken = loginResponse.body.token;
    });

    describe('Cenários de Sucesso', () => {
      it('deve atualizar o nome do usuário', async () => {
        const response = await request(testApp)
          .put(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ nome: 'Nome Atualizado' })
          .expect(200);

        expect(response.body.nome).toBe('Nome Atualizado');
      });

      it('deve atualizar o telefone do usuário', async () => {
        const response = await request(testApp)
          .put(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ telefone: '11888888888' })
          .expect(200);

        expect(response.body.telefone).toBe('11888888888');
      });

      it('deve atualizar o endereço parcialmente', async () => {
        const response = await request(testApp)
          .put(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ endereco: { cidade: 'Rio de Janeiro' } })
          .expect(200);

        expect(response.body.endereco.cidade).toBe('Rio de Janeiro');
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 401 sem autenticação', async () => {
        await request(testApp)
          .put(`/api/v1/users/${userId}`)
          .send({ nome: 'Nome Atualizado' })
          .expect(401);
      });

      it('deve retornar erro 400 para telefone inválido', async () => {
        await request(testApp)
          .put(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ telefone: '123' })
          .expect(400);
      });
    });
  });

  // ==========================================
  // TESTES DE CHANGE PASSWORD
  // ==========================================
  describe('PATCH /api/v1/users/change-password - Alterar Senha', () => {
    let userToken: string;

    beforeEach(async () => {
      await request(testApp).post('/api/v1/users').send(validUserData);
      const loginResponse = await request(testApp)
        .post('/api/v1/users/login')
        .send({ email: validUserData.email, senha: validUserData.senha });
      userToken = loginResponse.body.token;
    });

    describe('Cenários de Sucesso', () => {
      it('deve alterar a senha com sucesso', async () => {
        const response = await request(testApp)
          .patch('/api/v1/users/change-password')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ senhaAtual: validUserData.senha, novaSenha: 'NovaSenha@456' })
          .expect(200);

        expect(response.body.message).toContain('sucesso');
      });

      it('deve permitir login com nova senha', async () => {
        await request(testApp)
          .patch('/api/v1/users/change-password')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ senhaAtual: validUserData.senha, novaSenha: 'NovaSenha@456' });

        const loginResponse = await request(testApp)
          .post('/api/v1/users/login')
          .send({ email: validUserData.email, senha: 'NovaSenha@456' })
          .expect(200);

        expect(loginResponse.body).toHaveProperty('token');
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro para senha atual incorreta', async () => {
        await request(testApp)
          .patch('/api/v1/users/change-password')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ senhaAtual: 'SenhaErrada@123', novaSenha: 'NovaSenha@456' })
          .expect(500); // O serviço lança erro
      });

      it('deve retornar erro 400 para nova senha fraca', async () => {
        await request(testApp)
          .patch('/api/v1/users/change-password')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ senhaAtual: validUserData.senha, novaSenha: '123' })
          .expect(400);
      });

      it('deve retornar erro 401 sem autenticação', async () => {
        await request(testApp)
          .patch('/api/v1/users/change-password')
          .send({ senhaAtual: validUserData.senha, novaSenha: 'NovaSenha@456' })
          .expect(401);
      });
    });
  });

  // ==========================================
  // TESTES DE DELETE USER
  // ==========================================
  describe('DELETE /api/v1/users/:id - Deletar Usuário', () => {
    let userToken: string;
    let userId: string;

    beforeEach(async () => {
      const createResponse = await request(testApp).post('/api/v1/users').send(validUserData);
      userId = createResponse.body._id;

      const loginResponse = await request(testApp)
        .post('/api/v1/users/login')
        .send({ email: validUserData.email, senha: validUserData.senha });
      userToken = loginResponse.body.token;
    });

    describe('Cenários de Sucesso', () => {
      it('deve deletar o próprio usuário', async () => {
        const response = await request(testApp)
          .delete(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200);

        expect(response.body.message).toContain('deletado');
      });

      it('usuário não deve existir após deleção', async () => {
        await request(testApp)
          .delete(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`);

        const user = await User.findById(userId);
        expect(user).toBeNull();
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 401 sem autenticação', async () => {
        await request(testApp)
          .delete(`/api/v1/users/${userId}`)
          .expect(401);
      });

      it('deve retornar erro 403 ao tentar deletar outro usuário', async () => {
        const otherUserData = {
          ...validUserData,
          email: 'outro@email.com',
          cpf: '987.654.321-00',
        };
        const otherUserResponse = await request(testApp).post('/api/v1/users').send(otherUserData);
        const otherUserId = otherUserResponse.body._id;

        await request(testApp)
          .delete(`/api/v1/users/${otherUserId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(403);
      });
    });
  });

  // ==========================================
  // TESTES DE FORGOT PASSWORD
  // ==========================================
  describe('POST /api/v1/users/forgot-password - Esqueci Senha', () => {
    beforeEach(async () => {
      await request(testApp).post('/api/v1/users').send(validUserData);
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro para email inexistente', async () => {
        const response = await request(testApp)
          .post('/api/v1/users/forgot-password')
          .send({ email: 'naoexiste@email.com' });

        // Pode retornar erro ou sucesso (por segurança, alguns sistemas não revelam se o email existe)
        expect(response.status).toBeGreaterThanOrEqual(400);
      });

      it('deve retornar erro 400 para email inválido', async () => {
        await request(testApp)
          .post('/api/v1/users/forgot-password')
          .send({ email: 'email-invalido' })
          .expect(400);
      });
    });
  });
});
