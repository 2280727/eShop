// Mock for Sequelize models
class MockSequelize {
  constructor() {
    this.models = {};
  }

  define(modelName, attributes, options) {
    const model = new MockModel(modelName, attributes, options);
    this.models[modelName] = model;
    return model;
  }

  async authenticate() {
    return Promise.resolve();
  }
}

class MockModel {
  constructor(name, attributes, options) {
    this.name = name;
    this.attributes = attributes;
    this.options = options;
    this._mockData = [];
  }

  static async findAll(options) {
    return this._mockData || [];
  }

  static async findOne(options) {
    return this._mockData ? this._mockData[0] : null;
  }

  static setMockData(data) {
    this._mockData = data;
  }

  static hasOne() {}
  static belongsTo() {}
}

// Create mock instances
const mockSequelize = new MockSequelize();

// Mock Product model
const mockProductModel = {
  findAll: jest.fn(),
  rawAttributes: {
    category: {
      type: {
        values: ["men's clothing", "women's clothing", "jewelery", "electronics"]
      }
    }
  }
};

// Mock Rating model
const mockRatingModel = {
  findAll: jest.fn()
};

export { mockSequelize, mockProductModel, mockRatingModel, MockModel };

