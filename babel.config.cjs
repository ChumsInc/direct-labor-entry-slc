const presets = [
    [
        "@babel/preset-env",
        {
            "useBuiltIns": "entry",
            "corejs": "3.22"
        }
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
];

const plugins = [
];


module.exports = {
    presets,
    plugins,
};
