import { Test, TestingModule } from '@nestjs/testing';
import { Children } from './children';

describe('Children', () => {
  let provider: Children;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Children],
    }).compile();

    provider = module.get<Children>(Children);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
