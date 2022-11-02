const getPathToImage = (attribut: string): string => {
  try {
    return require('../../../../../../assets/img/'+ attribut +'.png');
  } catch (err) {
    return undefined;
  }
};

export { getPathToImage };
