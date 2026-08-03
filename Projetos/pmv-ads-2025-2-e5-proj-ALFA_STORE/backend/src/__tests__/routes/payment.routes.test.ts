import request from 'supertest';
import { testApp } from '../testApp';
import User from '../../models/user.model';

// Mock do serviço de pagamento para evitar chamadas reais ao Mercado Pago
jest.mock('../../services/payment.service', () => ({
  createCheckoutPreference: jest.fn(),
}));

import { createCheckoutPreference } from '../../services/payment.service';

const mockCreateCheckoutPreference = createCheckoutPreference as jest.MockedFunction<typeof createCheckoutPreference>;

describe('Payment Routes', () => {
  // Dados de usuário para autenticação
  const clientUserData = {
    nome: 'Cliente Pagamento',
    email: 'pagamento@teste.com',
    cpf: '123.456.789-00',
    telefone: '11999999999',
    senha: 'Cliente@123',
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

  // Dados válidos de preferência de pagamento
  const validPaymentData = {
    items: [
      {
        title: 'Sandália Feminina',
        quantity: 2,
        unit_price: 99.90,
        currency_id: 'BRL',
      },
    ],
    external_reference: 'ORDER-12345',
  };

  let clientToken: string;

  beforeEach(async () => {
    // Reset mocks
    mockCreateCheckoutPreference.mockReset();

    // Cria e loga usuário
    await request(testApp).post('/api/v1/users').send(clientUserData);
    const loginResponse = await request(testApp)
      .post('/api/v1/users/login')
      .send({ email: clientUserData.email, senha: clientUserData.senha });
    clientToken = loginResponse.body.token;
  });

  // ==========================================
  // TESTES DE CRIAR PREFERÊNCIA DE PAGAMENTO
  // ==========================================
  describe('POST /api/v1/payments/preferences - Criar Preferência de Checkout', () => {
    describe('Cenários de Sucesso', () => {
      it('deve criar preferência de pagamento com dados válidos', async () => {
        // Mock da resposta do Mercado Pago
        const mockPreferenceResponse = {
          id: 'PREF_123456789',
          init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=PREF_123456789',
          sandbox_init_point: 'https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=PREF_123456789',
          date_created: new Date().toISOString(),
        };

        mockCreateCheckoutPreference.mockResolvedValue(mockPreferenceResponse as any);

        const response = await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(validPaymentData)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('init_point');
        expect(mockCreateCheckoutPreference).toHaveBeenCalledTimes(1);
      });

      it('deve criar preferência com múltiplos itens', async () => {
        const multiItemData = {
          items: [
            { title: 'Sandália 1', quantity: 1, unit_price: 99.90 },
            { title: 'Sandália 2', quantity: 2, unit_price: 79.90 },
            { title: 'Sandália 3', quantity: 1, unit_price: 129.90 },
          ],
          external_reference: 'ORDER-MULTI-123',
        };

        mockCreateCheckoutPreference.mockResolvedValue({
          id: 'PREF_MULTI_123',
          init_point: 'https://mercadopago.com/checkout',
        } as any);

        const response = await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(multiItemData)
          .expect(201);

        expect(response.body).toHaveProperty('id');
      });

      it('deve criar preferência com informações do payer', async () => {
        const dataWithPayer = {
          ...validPaymentData,
          payer: {
            email: 'cliente@email.com',
            name: 'João',
            surname: 'Silva',
            phone: {
              area_code: '11',
              number: '999999999',
            },
          },
        };

        mockCreateCheckoutPreference.mockResolvedValue({
          id: 'PREF_PAYER_123',
          init_point: 'https://mercadopago.com/checkout',
        } as any);

        const response = await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(dataWithPayer)
          .expect(201);

        expect(response.body).toHaveProperty('id');
      });

      it('deve criar preferência com back_urls personalizadas', async () => {
        const dataWithUrls = {
          ...validPaymentData,
          back_urls: {
            success: 'https://meusite.com/sucesso',
            failure: 'https://meusite.com/falha',
            pending: 'https://meusite.com/pendente',
          },
        };

        mockCreateCheckoutPreference.mockResolvedValue({
          id: 'PREF_URLS_123',
          init_point: 'https://mercadopago.com/checkout',
        } as any);

        const response = await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(dataWithUrls)
          .expect(201);

        expect(response.body).toHaveProperty('id');
      });

      it('deve criar preferência com informações de envio', async () => {
        const dataWithShipments = {
          ...validPaymentData,
          shipments: {
            receiver_address: {
              zip_code: '01234-567',
              street_name: 'Rua Teste',
              street_number: '123',
              city_name: 'São Paulo',
              state_name: 'SP',
            },
          },
        };

        mockCreateCheckoutPreference.mockResolvedValue({
          id: 'PREF_SHIP_123',
          init_point: 'https://mercadopago.com/checkout',
        } as any);

        const response = await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(dataWithShipments)
          .expect(201);

        expect(response.body).toHaveProperty('id');
      });
    });

    describe('Cenários de Falha - Autenticação', () => {
      it('deve retornar erro 401 sem token de autenticação', async () => {
        await request(testApp)
          .post('/api/v1/payments/preferences')
          .send(validPaymentData)
          .expect(401);
      });

      it('deve retornar erro 401 com token inválido', async () => {
        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', 'Bearer token-invalido-123')
          .send(validPaymentData)
          .expect(401);
      });

      it('deve retornar erro 401 com token expirado', async () => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyMn0.4S5_Ck5L3lM0H7qK5K5L3lM0H7qK5K5L3lM0H7qK';
        
        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${expiredToken}`)
          .send(validPaymentData)
          .expect(401);
      });
    });

    describe('Cenários de Falha - Validação', () => {
      it('deve retornar erro 400 sem items', async () => {
        const invalidData = { external_reference: 'ORDER-123' };

        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(invalidData)
          .expect(400);
      });

      it('deve retornar erro 400 com array de items vazio', async () => {
        const invalidData = { items: [], external_reference: 'ORDER-123' };

        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(invalidData)
          .expect(400);
      });

      it('deve retornar erro 400 sem external_reference', async () => {
        const invalidData = {
          items: [{ title: 'Produto', quantity: 1, unit_price: 10 }],
        };

        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(invalidData)
          .expect(400);
      });

      it('deve retornar erro 400 para item sem título', async () => {
        const invalidData = {
          items: [{ quantity: 1, unit_price: 10 }],
          external_reference: 'ORDER-123',
        };

        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(invalidData)
          .expect(400);
      });

      it('deve retornar erro 400 para quantidade negativa', async () => {
        const invalidData = {
          items: [{ title: 'Produto', quantity: -1, unit_price: 10 }],
          external_reference: 'ORDER-123',
        };

        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(invalidData)
          .expect(400);
      });

      it('deve retornar erro 400 para preço unitário negativo', async () => {
        const invalidData = {
          items: [{ title: 'Produto', quantity: 1, unit_price: -10 }],
          external_reference: 'ORDER-123',
        };

        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(invalidData)
          .expect(400);
      });

      it('deve retornar erro 400 para email de payer inválido', async () => {
        const invalidData = {
          ...validPaymentData,
          payer: { email: 'email-invalido' },
        };

        await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(invalidData)
          .expect(400);
      });
    });

    describe('Cenários de Falha - Serviço', () => {
      it('deve retornar erro 503 quando token do Mercado Pago não está configurado', async () => {
        mockCreateCheckoutPreference.mockRejectedValue(
          new Error('Token de acesso do Mercado Pago nao configurado. Defina MERCADO_PAGO_ACCESS_TOKEN no arquivo .env.')
        );

        const response = await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(validPaymentData)
          .expect(503);

        expect(response.body.code).toBe('PAYMENT_SERVICE_UNAVAILABLE');
      });

      it('deve retornar erro 500 para erro genérico do Mercado Pago', async () => {
        mockCreateCheckoutPreference.mockRejectedValue(
          new Error('Erro de conexão com o Mercado Pago')
        );

        const response = await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(validPaymentData)
          .expect(500);

        expect(response.body.code).toBe('PAYMENT_PREFERENCE_ERROR');
      });

      it('deve retornar erro 500 para timeout do Mercado Pago', async () => {
        mockCreateCheckoutPreference.mockRejectedValue(
          new Error('Request timeout')
        );

        const response = await request(testApp)
          .post('/api/v1/payments/preferences')
          .set('Authorization', `Bearer ${clientToken}`)
          .send(validPaymentData)
          .expect(500);

        expect(response.body).toHaveProperty('message');
      });
    });
  });

  // ==========================================
  // TESTES DE CONTEXTO DO USUÁRIO
  // ==========================================
  describe('Contexto do Usuário no Pagamento', () => {
    it('deve passar os dados do usuário autenticado para o serviço', async () => {
      mockCreateCheckoutPreference.mockResolvedValue({
        id: 'PREF_CONTEXT_123',
        init_point: 'https://mercadopago.com/checkout',
      } as any);

      await request(testApp)
        .post('/api/v1/payments/preferences')
        .set('Authorization', `Bearer ${clientToken}`)
        .send(validPaymentData)
        .expect(201);

      // Verifica que o serviço foi chamado com o contexto do usuário
      expect(mockCreateCheckoutPreference).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: expect.any(String),
          userEmail: clientUserData.email,
          userName: clientUserData.nome,
        })
      );
    });
  });
});
