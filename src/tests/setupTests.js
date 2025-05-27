jest.mock('../../../models', () => {
  const actualModels = jest.requireActual('../../../models');
  
  return {
    ...actualModels,
    Cliente: {
      ...actualModels.Cliente,
      findByPk: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn()
    },
    Cita: {
      ...actualModels.Cita,
      findByPk: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn()
    },
    // TODO: montar los test similares para los otros modulos
  };
});

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));