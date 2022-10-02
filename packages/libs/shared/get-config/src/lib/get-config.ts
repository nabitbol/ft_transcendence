import config from "../../../../../../config";

const getPathToImage = (attribut: string): string => {
  return require(`../../../../../../assets/img/${config.img[attribut]}.png`);
};

export { getPathToImage };
