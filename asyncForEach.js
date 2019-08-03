module.exports = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    try {
      let result = await callback(array[index], index, array);
      if (result === -1) break;
    } catch (err) {
      console.log(err);
      break;
    }
  }
};
