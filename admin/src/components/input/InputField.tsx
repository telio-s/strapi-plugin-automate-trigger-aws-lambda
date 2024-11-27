import React from 'react';
import { Field } from '@strapi/design-system';
import { Controller, RegisterOptions, Path } from 'react-hook-form';
import { useRootContext } from '../../pages/HomePage';
import { TPlugin } from '../../../../shared/types';

type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends Record<string, any>
    ? `${K}` | `${K}.${NestedKeys<T[K]>}` // Recurse for nested objects
    : `${K}`; // common case
}[keyof T & string];
type TNameForm = NestedKeys<TPlugin>;
type TInputField = {
  label: string;
  name: TNameForm;
  rules: RegisterOptions<TPlugin>;
  input: React.InputHTMLAttributes<HTMLInputElement>;
};

const getNestedError = (obj: any, path: string) => {
  return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
};

const InputField = (props: TInputField) => {
  const { label, name, input, rules } = props;
  const { control, formState } = useRootContext();
  const { errors } = formState;
  return (
    <>
      <Field.Root error={getNestedError(errors, name)?.message}>
        <Field.Label>{label}</Field.Label>
        <Controller
          name={name as Path<TPlugin>}
          control={control}
          rules={rules}
          render={({ field }) => <Field.Input {...field} invalid={!!errors.name} {...input} />}
        />
        <Field.Error />
      </Field.Root>
    </>
  );
};

export { InputField, TInputField };
