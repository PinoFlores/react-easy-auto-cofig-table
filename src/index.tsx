import _ from 'lodash';
import React, { FC, HTMLAttributes, ReactChild, ComponentType } from 'react';
import { useSetFilter, withAutoConfig } from './contexts/EasyAutoConfigTable';

export const withEasyTable =
  (Controller: ComponentType) =>
  (props: any): JSX.Element => {
    const { name, onChange, defaultValue } = props;

    const { state, setFilter } = useSetFilter();

    const handleOnChange = (name: string, value: any) => {
      setFilter(name, value);
      onChange(name, value);
    };

    return (
      <Controller
        {...props}
        value={_.get(state, name, defaultValue)}
        onChange={handleOnChange}
      />
    );
  };

export interface Props extends HTMLAttributes<HTMLDivElement> {
  /** custom content, defaults to 'the snozzberries taste like snozzberries' */
  children?: ReactChild;
}

const Text = (props: any) => {
  return (
    <input
      type="text"
      onChange={({ target }) => {
        props.onChange('name', target.value);
      }}
    />
  );
};

const Table = (props: any) => {
  console.log(props.state);

  return <form>{props.children}</form>;
};

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing: FC<Props> = ({ children }) => {
  const WithTable = withEasyTable(Text);

  const DecTable = withAutoConfig(Table);

  return (
    <div>
      <DecTable>
        <WithTable
          onChange={(name: string, value: string) => {
            console.log(name, value);
          }}
        />
      </DecTable>
      {children || `the snozzberries taste like snozzberries`}
    </div>
  );
};
