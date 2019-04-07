class Service {
  constructor(dependencies) {
    this.someDependency = dependencies.someDependency;
  }

  doWork(a, b) {
    const sum = a + b;
    if (sum >= 0) {
      return sum;
    }

    return 0;
  }

  doSomethingElse(input) {
    return this.someDependency(input);
  }
}

module.exports = Service;
