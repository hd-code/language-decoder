module.exports = {
    packagerConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
        },
        {
            name: "@electron-forge/maker-zip",
        },
    ],
    plugins: [
        [
            "@electron-forge/plugin-webpack",
            {
                mainConfig: "./webpack.main.config.js",
                renderer: {
                    config: "./webpack.renderer.config.js",
                    entryPoints: [
                        {
                            name: "main_window",
                            html: "./src/ui/index.html",
                            js: "./src/ui/index.ts",
                            preload: {
                                js: "./src/preload.ts",
                            },
                        },
                    ],
                },
            },
        ],
    ],
};
