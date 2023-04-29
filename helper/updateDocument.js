const updateDocument = (document, properties) => {
  for (key of Object.keys(document)) {
    document[key] = properties[key] ? properties[key] : document[key];
    console.log(` ${key}: ${document[key]}`);
  }
};
module.exports = updateDocument;
