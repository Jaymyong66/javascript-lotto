import { LOTTO_PRICE, MAX_PURCHASABLE_CASH } from '../constants/lotto';
import { ALERT_MESSAGE } from '../constants/message';

export const validateCashInput = cash => {
  if (cash > MAX_PURCHASABLE_CASH) {
    throw new Error(ALERT_MESSAGE.OVER_MAX_CASH);
  }

  if (cash % LOTTO_PRICE !== 0) {
    throw new Error(ALERT_MESSAGE.NOT_DIVISIBLE);
  }
};

export const validatePickedNumbers = pickedNumbers => {
  if (pickedNumbers.length !== new Set(pickedNumbers).size) {
    throw new Error(ALERT_MESSAGE.DUPLICATED_NUMBER);
  }
};
