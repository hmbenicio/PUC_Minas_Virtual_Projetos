import request from 'supertest';
import { testApp } from '../testApp';
import User from '../../models/user.model';
import Product from '../../models/product.model';

describe('Product Routes', () => {
  // Dados de teste válidos para produto
  const validProductData = {
    nome: 'Sandália Teste',
    tipo: 'M',
    tamanho: '40',
    estampa: false,
    preco: 99.90,
    quantidade: 10,
    promo: false,
  };

  // Dados de usuário admin para autenticação
  const adminUserData = {
    nome: 'Admin Teste',
    email: 'admin@teste.com',
    cpf: '111.222.333-44',
    telefone: '11999999999',
    senha: 'Admin@123',
    role: 'admin',
    endereco: {
      rua: 'Rua Admin',
      numero: '100',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
    },
    consentimentoDados: {
      termosDeUso: true,
      politicaDePrivacidade: true,
    },
  };

  // Dados de usuário cliente
  const clientUserData = {
    nome: 'Cliente Teste',
    email: 'cliente@teste.com',
    cpf: '555.666.777-88',
    telefone: '11888888888',
    senha: 'Cliente@123',
    endereco: {
      rua: 'Rua Cliente',
      numero: '200',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '09876-543',
    },
    consentimentoDados: {
      termosDeUso: true,
      politicaDePrivacidade: true,
    },
  };

  let adminToken: string;
  let clientToken: string;

  // Cria usuários e obtém tokens antes de todos os testes
  beforeEach(async () => {
    // Cria admin diretamente no banco (já que registro público não permite criar admin)
    const admin = new User(adminUserData);
    await admin.save();

    // Login do admin
    const adminLogin = await request(testApp)
      .post('/api/v1/users/login')
      .send({ email: adminUserData.email, senha: adminUserData.senha });
    adminToken = adminLogin.body.token;

    // Cria e loga cliente
    await request(testApp).post('/api/v1/users').send(clientUserData);
    const clientLogin = await request(testApp)
      .post('/api/v1/users/login')
      .send({ email: clientUserData.email, senha: clientUserData.senha });
    clientToken = clientLogin.body.token;
  });

  // ==========================================
  // TESTES DE LISTAR PRODUTOS (GET /products)
  // ==========================================
  describe('GET /api/v1/products - Listar Produtos', () => {
    describe('Cenários de Sucesso', () => {
      it('deve retornar lista vazia quando não há produtos', async () => {
        const response = await request(testApp)
          .get('/api/v1/products')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
      });

      it('deve retornar lista de produtos sem autenticação', async () => {
        // Cria um produto primeiro
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(validProductData);

        const response = await request(testApp)
          .get('/api/v1/products')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nome).toBe(validProductData.nome);
      });

      it('deve retornar múltiplos produtos', async () => {
        // Cria vários produtos
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(validProductData);

        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ ...validProductData, nome: 'Sandália 2', tamanho: '42' });

        const response = await request(testApp)
          .get('/api/v1/products')
          .expect(200);

        expect(response.body.length).toBe(2);
      });
    });
  });

  // ==========================================
  // TESTES DE BUSCAR PRODUTO POR ID
  // ==========================================
  describe('GET /api/v1/products/:id - Buscar Produto por ID', () => {
    let productId: string;

    beforeEach(async () => {
      const response = await request(testApp)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validProductData);
      productId = response.body._id;
    });

    describe('Cenários de Sucesso', () => {
      it('deve retornar produto pelo ID sem autenticação', async () => {
        const response = await request(testApp)
          .get(`/api/v1/products/${productId}`)
          .expect(200);

        expect(response.body._id).toBe(productId);
        expect(response.body.nome).toBe(validProductData.nome);
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 404 para ID inexistente', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        await request(testApp)
          .get(`/api/v1/products/${fakeId}`)
          .expect(404);
      });

      it('deve retornar erro para ID inválido', async () => {
        const response = await request(testApp)
          .get('/api/v1/products/id-invalido');

        expect(response.status).toBeGreaterThanOrEqual(400);
      });
    });
  });

  // ==========================================
  // TESTES DE CRIAR PRODUTO (POST /products)
  // ==========================================
  describe('POST /api/v1/products - Criar Produto', () => {
    describe('Cenários de Sucesso', () => {
      it('admin deve criar produto com dados válidos', async () => {
        const response = await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(validProductData)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.nome).toBe(validProductData.nome);
        expect(response.body.preco).toBe(validProductData.preco);
      });

      it('deve criar produto com promoção', async () => {
        const promoProduct = {
          ...validProductData,
          promo: true,
          precoPromo: 79.90,
        };

        const response = await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(promoProduct)
          .expect(201);

        expect(response.body.promo).toBe(true);
        expect(response.body.precoPromo).toBe(79.90);
      });

      it('deve criar produto de todos os tipos válidos', async () => {
        const tipos = ['M', 'F', 'I', 'E'];

        for (const tipo of tipos) {
          const product = { ...validProductData, nome: `Sandália ${tipo}`, tipo };
          const response = await request(testApp)
            .post('/api/v1/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(product)
            .expect(201);

          expect(response.body.tipo).toBe(tipo);
        }
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 401 sem autenticação', async () => {
        await request(testApp)
          .post('/api/v1/products')
          .send(validProductData)
          .expect(401);
      });

      it('deve retornar erro 403 para cliente (não admin)', async () => {
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(validProductData)
          .expect(403);
      });

      it('deve retornar erro 400 para nome muito curto', async () => {
        const invalidProduct = { ...validProductData, nome: 'AB' };
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidProduct)
          .expect(400);
      });

      it('deve retornar erro 400 para tipo inválido', async () => {
        const invalidProduct = { ...validProductData, tipo: 'X' };
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidProduct)
          .expect(400);
      });

      it('deve retornar erro 400 para preço negativo', async () => {
        const invalidProduct = { ...validProductData, preco: -10 };
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidProduct)
          .expect(400);
      });

      it('deve retornar erro 400 para quantidade negativa', async () => {
        const invalidProduct = { ...validProductData, quantidade: -5 };
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidProduct)
          .expect(400);
      });

      it('deve retornar erro 400 para promo sem precoPromo', async () => {
        const invalidProduct = { ...validProductData, promo: true };
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidProduct)
          .expect(400);
      });

      it('deve retornar erro 400 quando precoPromo >= preco', async () => {
        const invalidProduct = { ...validProductData, promo: true, precoPromo: 150 };
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidProduct)
          .expect(400);
      });

      it('deve retornar erro 400 sem campo obrigatório (nome)', async () => {
        const { nome, ...invalidProduct } = validProductData;
        await request(testApp)
          .post('/api/v1/products')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(invalidProduct)
          .expect(400);
      });
    });
  });

  // ==========================================
  // TESTES DE ATUALIZAR PRODUTO (PUT /products/:id)
  // ==========================================
  describe('PUT /api/v1/products/:id - Atualizar Produto', () => {
    let productId: string;

    beforeEach(async () => {
      const response = await request(testApp)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validProductData);
      productId = response.body._id;
    });

    describe('Cenários de Sucesso', () => {
      it('admin deve atualizar nome do produto', async () => {
        const response = await request(testApp)
          .put(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ nome: 'Sandália Atualizada' })
          .expect(200);

        expect(response.body.nome).toBe('Sandália Atualizada');
      });

      it('admin deve atualizar preço do produto', async () => {
        const response = await request(testApp)
          .put(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ preco: 129.90 })
          .expect(200);

        expect(response.body.preco).toBe(129.90);
      });

      it('admin deve atualizar quantidade em estoque', async () => {
        const response = await request(testApp)
          .put(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantidade: 50 })
          .expect(200);

        expect(response.body.quantidade).toBe(50);
      });

      it('admin deve ativar promoção', async () => {
        const response = await request(testApp)
          .put(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ promo: true, precoPromo: 79.90, preco: 99.90 })
          .expect(200);

        expect(response.body.promo).toBe(true);
        expect(response.body.precoPromo).toBe(79.90);
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 401 sem autenticação', async () => {
        await request(testApp)
          .put(`/api/v1/products/${productId}`)
          .send({ nome: 'Sandália Atualizada' })
          .expect(401);
      });

      it('deve retornar erro 403 para cliente (não admin)', async () => {
        await request(testApp)
          .put(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${clientToken}`)
          .send({ nome: 'Sandália Atualizada' })
          .expect(403);
      });

      it('deve retornar erro 404 para produto inexistente', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        await request(testApp)
          .put(`/api/v1/products/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ nome: 'Sandália Atualizada' })
          .expect(404);
      });

      it('deve retornar erro 400 para preço negativo', async () => {
        await request(testApp)
          .put(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ preco: -10 })
          .expect(400);
      });
    });
  });

  // ==========================================
  // TESTES DE DELETAR PRODUTO (DELETE /products/:id)
  // ==========================================
  describe('DELETE /api/v1/products/:id - Deletar Produto', () => {
    let productId: string;

    beforeEach(async () => {
      const response = await request(testApp)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validProductData);
      productId = response.body._id;
    });

    describe('Cenários de Sucesso', () => {
      it('admin deve deletar produto', async () => {
        const response = await request(testApp)
          .delete(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.message).toContain('deletado');
      });

      it('produto não deve existir após deleção', async () => {
        await request(testApp)
          .delete(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        const product = await Product.findById(productId);
        expect(product).toBeNull();
      });
    });

    describe('Cenários de Falha', () => {
      it('deve retornar erro 401 sem autenticação', async () => {
        await request(testApp)
          .delete(`/api/v1/products/${productId}`)
          .expect(401);
      });

      it('deve retornar erro 403 para cliente (não admin)', async () => {
        await request(testApp)
          .delete(`/api/v1/products/${productId}`)
          .set('Authorization', `Bearer ${clientToken}`)
          .expect(403);
      });

      it('deve retornar erro 404 para produto inexistente', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        await request(testApp)
          .delete(`/api/v1/products/${fakeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404);
      });
    });
  });
});
