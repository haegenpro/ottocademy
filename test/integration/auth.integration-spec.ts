import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../src/backend/auth/auth.service';
import { PrismaService } from '../../src/backend/prisma/prisma.service';

/**
 * Integration test: exercises AuthService against a REAL Postgres database
 * (see docker-compose.test.yml / the `integration-test` CI job for how the
 * database is provisioned) through the real Prisma client - no HTTP layer,
 * no mocks for the database, and no calls to Google OAuth or GCS.
 *
 * This is deliberately "API-less": it drives the service layer directly
 * instead of going through supertest + the NestJS HTTP server, so it can
 * run without booting Passport/GCS wiring and stays fast + deterministic.
 */
describe('AuthService (integration)', () => {
  let moduleRef: TestingModule;
  let authService: AuthService;
  let prisma: PrismaService;

  const testEmailDomain = `@integration-test.local`;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        'DATABASE_URL is not set - integration tests must run against a real Postgres instance.',
      );
    }

    moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        {
          provide: JwtService,
          useValue: new JwtService({ secret: 'integration-test-secret' }),
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
  });

  afterEach(async () => {
    // Keep the shared test database clean between tests instead of relying
    // on test ordering.
    await prisma.user.deleteMany({
      where: { email: { endsWith: testEmailDomain } },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await moduleRef.close();
  });

  const uniqueUser = (suffix: string) => ({
    email: `user-${suffix}${testEmailDomain}`,
    username: `user_${suffix}`,
    password: 'Sup3rSecret!',
    confirm_password: 'Sup3rSecret!',
    first_name: 'Test',
    last_name: 'User',
  });

  it('registers a user and persists it in the real database', async () => {
    const dto = uniqueUser('register');

    const result = await authService.register(dto);

    expect(result).toMatchObject({
      email: dto.email,
      username: dto.username,
    });
    expect(result).not.toHaveProperty('password');

    const rowInDb = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    expect(rowInDb).not.toBeNull();
    // Password must be hashed at rest, never stored in plaintext.
    expect(rowInDb!.password).not.toBe(dto.password);
  });

  it('rejects registration when the email/username already exists', async () => {
    const dto = uniqueUser('duplicate');
    await authService.register(dto);

    await expect(authService.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('logs in with correct credentials and returns a working JWT', async () => {
    const dto = uniqueUser('login');
    await authService.register(dto);

    const { access_token, user } = await authService.login({
      identifier: dto.email,
      password: dto.password,
    });

    expect(access_token).toEqual(expect.any(String));
    expect(user.email).toBe(dto.email);
  });

  it('rejects login with a wrong password', async () => {
    const dto = uniqueUser('badpass');
    await authService.register(dto);

    await expect(
      authService.login({ identifier: dto.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
