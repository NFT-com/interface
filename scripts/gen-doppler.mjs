import { secretNames } from './doppler_secret_names.mjs';

import * as fs from 'fs';

const main = async () => {
  const names = Object.keys(secretNames).filter((name) => name.includes('REACT_APP_'));

  console.log(
    '! generating config types for the following secrets: ',
    names.join(', ')
  );

  const data = new Uint8Array(Buffer.from(
    '// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT DIRECTLY MODIFY THIS FILE.\n' +
    '// YOUR CHANGES ARE LIKELY TO BE OVERRIDDEN IN THE FUTURE\n' +
    'export enum Secret {\n' +
    names
      .map((name) => '  ' + name + ' = \'' + name + '\',\n')
      .join('') +
    '}\n' +
    '\nexport function getEnv(name: Secret): any {\n'+
    '  return process.env[name];\n' +
    '}\n' +
    '\nexport function getEnvBool(name: Secret): boolean {\n' +
    '  const value = process.env[name];\n' +
    '  if (typeof value === \'boolean\') {\n' +
    '    return value;\n' +
    '  } else if (value === \'true\') {\n' +
    '    return true;\n' +
    '  } else if (value === \'false\') {\n' +
    '    return false;\n' +
    '  } else {\n' +
    '    throw new Error(\'Not a boolean environment variable\');\n' +
    '  }\n' +
    '}'
  ));
  fs.writeFile('utils/getEnv.ts', data, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
};

main()
  .catch(console.error);

export {};