const {
  plugin,
  ABSTRACTION_LEVELS
} = require('../index');
const File = require('vinyl');
const PassThrough = require('stream').PassThrough;
const { expect } = require('chai');

describe('jsToFlowChartPlugin', () => {
  it('should throw a plugin error in stream mode', (done) => {
    const stream = plugin();
    const fakeStream = new PassThrough();
    const file = new File({
      contents: fakeStream
    });
    fakeStream.write(new Buffer('test'));
    fakeStream.end();

    stream.on('error', function(error) {
      expect(error.message).to.equal('Streams not supported!');
      done();
    });

    stream.on('end', function() {
      done(new Error('Stream error handler should have been called!'));
    });

    stream.write(file);
    stream.end();
  });

  it('should work in buffer mode', (done) => {
    const stream = plugin();
    const buffer = new Buffer(`
      function myFn(a) {
        console.log(a);
      }
    `);
    const file = new File({
      contents: buffer
    });

    stream.on('data', function(newFile) {
      expect(newFile).to.not.be.null;
      expect(newFile.contents).to.not.be.null;

      const stringContents = newFile.contents.toString('utf8');
      expect(stringContents).to.not.be.null;
      expect(stringContents.split('\n')[0]).to.equal('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
    });

    stream.on('end', function() {
      done();
    });

    stream.write(file);
    stream.end();
  });

  it('sets the top level node to the name of the file', (done) => {
    const stream = plugin();
    const buffer = new Buffer(`
      function myFn(a) {
        console.log(a);
      }
    `);
    const file = new File({
      name: 'myFn.js',
      contents: buffer
    });

    stream.on('data', function(newFile) {
      expect(newFile).to.not.be.null;
      expect(newFile.contents).to.not.be.null;

      const stringContents = newFile.contents.toString('utf8');
      expect(stringContents).to.not.be.null;
      expect(stringContents).to.contain('myFn.js');
    });

    stream.on('end', function() {
      done();
    });

    stream.write(file);
    stream.end();
  });

  describe('abstraction levels', () => {
    it('can define abstraction levels via options', (done) => {
      const stream = plugin({
        abstractionLevels: [
          ABSTRACTION_LEVELS.IMPORT,
          ABSTRACTION_LEVELS.EXPORT,
        ]
      });
      const buffer = new Buffer(`
        const fs = require('fs');
        module.exports = fs.readFile;
      `);
      const file = new File({
        name: 'readFile.js',
        contents: buffer
      });

      stream.on('data', function(newFile) {
        expect(newFile).to.not.be.null;
        expect(newFile.contents).to.not.be.null;

        const stringContents = newFile.contents.toString('utf8');
        expect(stringContents).to.not.be.null;
        expect(stringContents.split('\n')[0]).to.equal('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
      });

      stream.on('end', function() {
        done();
      });

      stream.write(file);
      stream.end();
    });
  });
});
