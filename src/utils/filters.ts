import _ from 'lodash';

const isEmpty = (value: any) => {
  return _.isEmpty(value) || _.isNull(value) || _.isUndefined(value);
};

export const extractParent = (index = '', sep = '.') => {
  if (index && _.isString(index) && index.includes(sep)) {
    return _.get(index.split(sep), '0');
  }
  return index;
};

export const handleMultiFilter = (
  filterIndex: any[] = [],
  value = '',
  op = 'equal',
  _condition = 'or',
  splitValue = false
) => {
  let holder = {};
  let finalValue: string[] | string = value;

  if (splitValue && !_.isArray(value)) {
    finalValue = value.split(' ');
  }

  for (let i = 0; i < filterIndex.length; i++) {
    const index = filterIndex[i];

    let val = splitValue ? finalValue[i] : value;

    if (isEmpty(val)) continue;

    if (['like', 'iLike'].includes(op)) {
      val = `%${val}%`;
      _.set(holder, index, { [op]: val });
    } else {
      _.set(holder, index, val);
    }
  }

  const parent = extractParent(_.get(filterIndex, '0'));
  if (parent) {
    _.set(holder, `${parent}._condition`, _condition);
  }

  return [parent, _.get(holder, parent)];
};

export const handleSingleFilter = (name: string, value = '', op = 'equal') => {
  if (isEmpty(value))
    throw new Error('[InternalReactEasyTable]: Invalid value!');
  let holder = {};
  if (['like', 'iLike'].includes(op))
    _.set(holder, name, { [op]: `%${value}%` });
  else _.set(holder, name, value);
  return [name, _.get(holder, name)];
};
