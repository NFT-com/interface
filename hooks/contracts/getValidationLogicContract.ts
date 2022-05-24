import { ValidationLogic__factory } from 'constants/typechain/factories/ValidationLogic__factory';
import { ValidationLogic } from 'constants/typechain/ValidationLogic';

import { Provider } from '@ethersproject/providers';

export function getValidationLogicContract(address: string, provider: Provider): ValidationLogic {
  return ValidationLogic__factory.connect(address, provider);
}