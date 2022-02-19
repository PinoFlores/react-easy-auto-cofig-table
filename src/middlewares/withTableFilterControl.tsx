import _ from 'lodash';
import {
  extractParent,
  handleMultiFilter,
  handleSingleFilter,
} from '../utils/filters';
import { isEmpty } from '../utils';
import React, { ComponentType } from 'react';
import { ErrorMessages } from '../constants/errors';
import { useEasyAutoConfigTable } from '../contexts/EasyAutoConfigTable';

type OpFilter = 'equal' | 'iLike' | 'like';

interface MultiFilterControlConfigs {
  as: 'multiple';
  op: OpFilter;
  splitValue?: boolean;
  filterIndex: string[];
  _condition: 'or' | 'and';
}

interface SingleFilterControlConfigs {
  as: 'single';
  op: OpFilter;
}

interface OverridedFilterControlConfigs {
  op: OpFilter;
  as: 'overrided';
  overrideQuery: (value: any) => OverridedFilterResponse;
}

type OverridedFilterResponse = {
  key: string;
  filter: any;
};

interface BaseControl {
  name: string;
  onChange: (name: string, value: any) => void;
  type: 'text' | 'select' | 'date' | 'daterange';
}

type TableFilterControlProps = BaseControl &
  (
    | MultiFilterControlConfigs
    | SingleFilterControlConfigs
    | OverridedFilterControlConfigs
  );

export const withTableFilterControl = (Controller: ComponentType<any>) => {
  return (props: TableFilterControlProps): JSX.Element => {
    const { op, name, type, onChange } = props;

    const { state, setFilter, setQuery } = useEasyAutoConfigTable();

    const handleOnChange = (name: string, value: any) => {
      // CASES HERE [multiple, overrided, single]
      if (props.as === 'multiple') {
        const { filterIndex, splitValue, _condition } = props;
        const invalidFilterIndexes =
          !filterIndex || !_.isArray(filterIndex) || _.isEmpty(filterIndex);

        if (invalidFilterIndexes) {
          throw new Error(ErrorMessages.InvalidFilterIndex);
        }

        const index = extractParent(filterIndex[0]);

        if (isEmpty(value)) setQuery('filter', index, null, 'delete');
        else {
          const [key, filter] = handleMultiFilter(
            filterIndex,
            value,
            op,
            _condition,
            splitValue
          );
          setQuery('filter', key, filter, 'set');
        }
      }

      if (props.as === 'overrided') {
        const { overrideQuery } = props;
        const { key, filter } = overrideQuery(value);
        if (isEmpty(value)) setQuery('filter', key, null, 'delete');
        else setQuery('filter', key, filter, 'set');
      }

      if (props.as === 'single') {
        if (isEmpty(value)) setQuery('filter', name, null, 'delete');
        else {
          const [key, filter] = handleSingleFilter(name, value, op);
          setQuery('filter', key, filter, 'set');
        }
      }

      setFilter(name, value);
      onChange(name, value);
    };

    let defVal = null;
    if (type === 'text') defVal = '';

    return (
      <Controller
        name={name}
        onChange={handleOnChange}
        value={_.get(state, name, defVal)}
      />
    );
  };
};
