import React, { createContext, useContext, ComponentType } from 'react';
import _ from 'lodash';

interface EasyAutoConfigTable {
  state: any;
  setFilter: (name: string, value: any) => void;
}

export const EasyAutoConfigTableContext = createContext<EasyAutoConfigTable>(
  {} as EasyAutoConfigTable
);

export const EasyAutoConfigTableProvider = (props: any) => {
  const [state, setState] = React.useState({});

  const setFilter = (name: string, value: any) => {
    setState((pre) => ({ ...pre, [name]: value }));
  };

  return (
    <EasyAutoConfigTableContext.Provider value={{ state, setFilter }}>
      {props.children}
    </EasyAutoConfigTableContext.Provider>
  );
};

export const useSetFilter = () => {
  const context = useContext(EasyAutoConfigTableContext);
  return {
    state: context.state,
    setFilter: context.setFilter,
  };
};

const useEasyAutoConfigTable = () => {
  return useContext(EasyAutoConfigTableContext);
};

const withHookProvider = (Table: ComponentType) => (props: any) => {
  const deps = useEasyAutoConfigTable();
  return <Table {...props} {...deps} />;
};

export const withAutoConfig = (Table: ComponentType) => (props: any) => {
  const TableWithDeps = withHookProvider(Table);
  return (
    <EasyAutoConfigTableProvider>
      <TableWithDeps {...props} />
    </EasyAutoConfigTableProvider>
  );
};
