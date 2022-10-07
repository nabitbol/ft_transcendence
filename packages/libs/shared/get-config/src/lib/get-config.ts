const getPathToImage = (attribut: string): string => {
  return require('../../../../../../assets/img/'+ attribut +'.png');
};

export { getPathToImage };
