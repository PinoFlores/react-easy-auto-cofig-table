import React from 'react';

import _ from 'lodash';
import { encode } from 'sequelize-search-builder-encode';
import { withTableFilterControl } from './middlewares/withTableFilterControl';

import { withTableConfig, TableProps } from './middlewares/withTableConfigs';

const Text = (props: any) => {
  return (
    <input
      {...props}
      type="text"
      className="form-control"
      onChange={({ target }) => {
        props.onChange(props.name, target.value);
      }}
    />
  );
};

const Table = (props: TableProps) => {
  const { query, _condition } = props;

  const [queryObject, setQueryObject] = React.useState({});

  React.useEffect(() => {
    setQueryObject({
      ...query,
      _condition,
    });
  }, [query]);

  const encoded = encode('http://localhost:8001/users', queryObject, false);
  const encoded2 = encode('http://localhost:8001/users', queryObject);

  return (
    <div>
      <form className="row g-3">{props.children}</form>

      <textarea
        className="col-12 form-control mt-2"
        name="k"
        id="d"
        value={encoded}
        onChange={() => {}}
      />

      <textarea
        className="col-12 form-control mt-2"
        name="k"
        id="d"
        onChange={() => {}}
        value={encoded2}
      />

      <pre>{JSON.stringify(queryObject, null, 2)}</pre>
    </div>
  );
};

export const Thing = ({}) => {
  const OwnerColumn = withTableFilterControl(Text);
  const EmailColumn = withTableFilterControl(Text);
  const DecTable = withTableConfig(Table);

  return (
    <div>
      <DecTable _condition="and">
        <div className="col-sm-6">
          <OwnerColumn
            op="like"
            type="text"
            name="name"
            as="multiple"
            _condition="or"
            splitValue={false}
            filterIndex={['owners.first_name', 'owners.last_name']}
            onChange={(name: string, value: string) => {
              console.log(name, value);
            }}
          />
        </div>
        <div className="col-sm-6">
          <EmailColumn
            type="text"
            as="overrided"
            name="email"
            op="like"
            overrideQuery={(value) => {
              return {
                key: 'email',
                filter: {
                  like: `%${value}%`,
                },
              };
            }}
            onChange={(name: string, value: string) => {
              console.log(name, value);
            }}
          />
        </div>
      </DecTable>
    </div>
  );
};
