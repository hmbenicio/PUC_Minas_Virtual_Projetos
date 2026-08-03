import request from 'supertest';
import { testApp } from '../testApp';

describe('Health Check Routes', () => {
  describe('GET / - Health Check', () => {
    it('deve retornar status ok', async () => {
      const response = await request(testApp)
        .get('/')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.message).toContain('AlfaStore');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('deve retornar timestamp válido', async () => {
      const response = await request(testApp)
        .get('/')
        .expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });
});
