var config = module.exports;

config["My tests"] = {
  rootPath : "../",
  environment : "node", // or "browser"
  sources : [
    "lib/*.js",
  ],
  tests : [ "test/*-test.js" ]
}
