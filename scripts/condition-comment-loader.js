/**
 * 条件注释loader
 * 
 * // #only dev start
 * 
 * // #only dev end
 * 
 * 
 * <!-- #only dev start --> xxxxx <!-- #only dev end -->
 */

const loaderUtils = require('loader-utils');

module.exports = function ConditionCommentLoader (source, map) {
    this.cacheable();

    const options = loaderUtils.getOptions(this) || {
        isProd: true,
    };
    const isProd = options.isProd;
    let result = source;

    if (isProd) {
        result = source.replace(/\/\/\s+#only dev start([\S\s]*?)\/\/\s+#only dev end.*/g, (a, b) => {
            let newLine = '';
            b.replace(/\n/g, () => {
                newLine += '\n';
            });
            return newLine;
        });

        result = result.replace(/<!--\s+#only dev start\s+-->([\S\s]*?)<!--\s+#only dev end\s+-->/g, (a, b) => {
            return '';
        });
    }

    this.callback(null, result, map);
};
