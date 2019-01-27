function printInfo (err, stats, isProd) {
    if (err) throw err;
    // production 模式下显示详细构建结果
    if (isProd) {
        console.log(stats.toString({
            assets: true,
            version: false,
            hash: false,
            colors: true,
            children: true,
            entrypoints: false,
            modules: false,
            chunks: false,
            chunkModules: false,
            timings: true,
        }));
    }
    // 显示 errors 和 warnings
    if (stats.hasErrors()) {
        stats.toJson().errors.forEach((e) => {
            console.error(e);
        });
    }
    if (stats.hasWarnings()) {
        stats.toJson().warnings.forEach((w) => {
            console.warn(w);
        });
    }
}

module.exports = printInfo;
