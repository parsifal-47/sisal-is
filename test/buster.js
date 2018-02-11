var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "node", // or "browser"
    sources: [
        "build/**/*.js",
    ],
    tests: [
        "test/*-test.js"
    ]
}
