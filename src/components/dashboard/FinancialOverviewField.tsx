import React from 'react';
import { Popup } from 'semantic-ui-react';
import { formatPriceFull } from '../../helpers/monetary';

interface Props {
  fields: string[],
  values: number[],
  type: 'value' | 'amount';
  header?: string;
}

export function FinancialOverviewField(props: Props) {
  if (props.fields.length !== props.values.length) {
    throw new TypeError('Number of fields does not equal the number of values');
  }

  const content: JSX.Element[] = props.values.map((value, i) => {
    let parsedValue;
    switch (props.type) {
      case 'amount': parsedValue = value; break;
      case 'value': parsedValue = formatPriceFull(value); break;
      default: throw new TypeError(`Unknown field type: ${props.type}`);
    }

    return (
      <>
        {`${props.fields[i]}: ${parsedValue}`}
        {i + 1 < props.values.length ? <br /> : undefined}
      </>
    );
  });

  if (props.header) {
    content.splice(0, 0, (
      <>
        <b>{props.header}</b>
        <br />
      </>
    ));
  }

  const valuesSum = props.values.reduce((a, b) => a + b, 0);
  let triggerValue;
  switch (props.type) {
    case 'amount': triggerValue = valuesSum; break;
    case 'value': triggerValue = formatPriceFull(valuesSum); break;
    default: throw new TypeError(`Unknown field type: ${props.type}`);
  }

  return (
    <Popup
      content={content}
      trigger={(
        <span>
          {triggerValue}
        </span>
      )}
    />
  );
}

FinancialOverviewField.defaultProps = {
  header: undefined,
};
