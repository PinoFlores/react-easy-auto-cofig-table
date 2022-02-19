import _ from 'lodash';

export const isEmpty = (value: any) => {
  return _.isEmpty(value) || _.isNull(value) || _.isUndefined(value);
};
