import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'net';
import { AppModule } from '../src/backend/app.module';

// Note: the installed `supertest` (7.x) ships no bundled TS types (no
// "types" field, no .d.ts) despite newer NestJS e2e boilerplate assuming
// one via `supertest/types` - that submodule doesn't exist here, so we
// rely on the separate `@types/supertest` package instead. Typing the app
// as INestApplication<Server> (rather than the default `any`) keeps
// getHttpServer() typed so it can be passed to request() safely.
describe('AppController (e2e)', () => {
  let app: INestApplication<Server>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
