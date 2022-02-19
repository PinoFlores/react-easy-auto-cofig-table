import React, { ComponentType } from 'react';
import {
  useEasyAutoConfigTable,
  EasyAutoConfigTableProvider,
} from '../contexts/EasyAutoConfigTable';

export type TableProps = {
  query?: {};
  children: React.ReactNode;
  _condition: 'or' | 'and';
};

const withHookProvider = (Table: ComponentType<TableProps>) => {
  return (props: TableProps) => {
    const deps = useEasyAutoConfigTable();
    return <Table {...props} {...deps} />;
  };
};

export const withTableConfig = (Table: ComponentType<TableProps>) => {
  return (props: TableProps) => {
    const TableWithDeps = withHookProvider(Table);
    return (
      <EasyAutoConfigTableProvider>
        <TableWithDeps {...props} />
      </EasyAutoConfigTableProvider>
    );
  };
};
