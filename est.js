const fs = require();

fs.readdir(path, async (err, files) => {
  if (!err) {
    files.forEach(async (file) => {
      const modelJson = require(path + file);
      const modelName = file.split('.')[0];

      console.log(modelJson);
    });
  }
});
