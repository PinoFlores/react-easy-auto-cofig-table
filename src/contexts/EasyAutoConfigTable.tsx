import _ from 'lodash';
import React, { createContext, useContext } from 'react';

type QueryItemType = 'page' | 'size' | 'include' | 'filter' | 'order';
type AddFilterCmd = 'set' | 'delete';

interface EasyAutoConfigTable {
  state: any;
  query: any;
  setFilter: (name: string, value: any) => void;
  setQuery: (
    type: QueryItemType,
    name: string,
    value: any,
    cmd: AddFilterCmd
  ) => void;
}

export const EasyAutoConfigTableContext = createContext<EasyAutoConfigTable>(
  {} as EasyAutoConfigTable
);

const ensureDef = (type: QueryItemType) => {
  switch (type) {
    case 'filter':
    case 'order':
      return {};
    case 'page':
      return 0;
    case 'size':
      return 10;
    default:
      return false;
  }
};

export const EasyAutoConfigTableProvider = (props: any) => {
  const [state, setState] = React.useState({});
  const [queryObject, setQueryObject] = React.useState({});

  const setFilter = (name: string, value: any) => {
    setState((pre) => ({ ...pre, [name]: value }));
  };

  const setQuery = (
    type: QueryItemType,
    name: string | string[],
    value: any | any[],
    cmd: AddFilterCmd
  ) => {
    if (_.isNull(value)) cmd = 'delete';
    let def = ensureDef(type);
    let part = _.get(queryObject, type, def);
    if (cmd === 'delete' && _.has(part, name)) {
      if (_.isArray(name)) {
        for (let n of name) {
          delete part[n];
        }
      } else {
        delete part[name];
      }
    } else {
      if (_.isArray(name)) {
        for (let i = 0; i < name.length; i++) {
          part = { ...part, [name[i]]: value[i] };
        }
      } else {
        part = { ...part, [name]: value };
      }
    }
    setQueryObject((pre) => ({ ...pre, [type]: part }));
  };

  return (
    <EasyAutoConfigTableContext.Provider
      value={{
        state,
        setQuery,
        setFilter,
        query: queryObject,
      }}
    >
      {props.children}
    </EasyAutoConfigTableContext.Provider>
  );
};

export const useEasyAutoConfigTable = () => {
  return useContext(EasyAutoConfigTableContext);
};
