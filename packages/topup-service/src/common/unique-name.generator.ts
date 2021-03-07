import {
  uniqueNamesGenerator,
  colors,
  animals,
  NumberDictionary,
} from 'unique-names-generator';

export function uniqueDeviceName() {
  const numberDictionary = NumberDictionary.generate({
    min: 10000,
    max: 99999,
  });

  return uniqueNamesGenerator({
    dictionaries: [colors, animals, numberDictionary],
    length: 3,
    separator: '-',
  });
}
