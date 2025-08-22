const untypedImages = {
  'utility-logo': require('./files/utility-logo.png'),
};

type ImageName = keyof typeof untypedImages;

const images = untypedImages as Record<ImageName, number>;

export { images };
