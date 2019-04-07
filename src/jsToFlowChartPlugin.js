const {
  createFlowTreeBuilder,
  createFlowTreeModifier,
  convertFlowTreeToSvg,
  MODIFIER_PRESETS
} = require('js2flowchart');
const map = require('map-stream');
const PluginError = require('plugin-error');
const PLUGIN_NAME = 'jsToFlowChartPlugin';

const jsToFlowChartPlugin = function(options) {
  options = options || {};
  return map(function(file, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streams not supported!'));
    }

    const code = file.contents.toString();

    const flowTreeBuilder = createFlowTreeBuilder({
      astParser: {
        plugins: []
      }
    });

    if (options.abstractionLevels && options.abstractionLevels.length > 0) {
      flowTreeBuilder.setAbstractionLevel(options.abstractionLevels);
    }

    const flowTree = flowTreeBuilder.build(code);
    const flowTreeModifier = createFlowTreeModifier();

    // update the top level node to the be name of the input file
    if (file.path) {
      const filename = file.path.replace(/^.*[\\\/]/, '');
      flowTreeModifier.registerNewModifier(
        (node) => {
          return node.type === 'Program';
        },
        {
          name: filename
        }
      );
    }

    // show array iterators like '.map' as a loop
    flowTreeModifier.setModifier(MODIFIER_PRESETS.es5ArrayIterators);
    flowTreeModifier.applyToFlowTree(flowTree);

    const svg = convertFlowTreeToSvg(flowTree);
    file.contents = new Buffer(svg);

    callback(null, file);
  });
};

module.exports = jsToFlowChartPlugin;
