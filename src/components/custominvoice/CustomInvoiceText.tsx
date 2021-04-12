import React, { ChangeEvent } from 'react';
import { Input, Segment } from 'semantic-ui-react';
import validator from 'validator';
import { Language } from '../../clients/server.generated';

interface Props {
  invoiceReason: string;
  language: Language;
  invoiceNumber: string;

  setAttribute: (attribute: string, value: string) => void;
}

function CustomInvoiceText(props: Props) {
  let prefix: string = '';
  let suffix: string = '';
  if (props.language === Language.DUTCH) {
    prefix = 'Naar aanleiding van ';
    suffix = ` sturen we u hierbij deze factuur.  Gelieve het verschuldigde bedrag binnen vijftien werkdagen over te maken naar IBAN NL22 ABNA 0528 1959 13 ten name van GEWIS te Eindhoven, onder vermelding van ''${props.invoiceNumber}''.`;
  } else if (props.language === Language.ENGLISH) {
    prefix = 'Following ';
    suffix = `, we hereby send you the invoice. Please transfer the agreed amount within fifteen workdays to IBAN NL22 ABNA 0528 1959 13 in the name of GEWIS, with mentioning ''${props.invoiceNumber}''.`;
  }

  return (
    <Segment secondary style={{ backgroundColor: 'rgba(243, 244, 245, 0.98)' }}>
      <h2>Invoice description</h2>
      {prefix}
      <Input
        value={props.invoiceReason}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.setAttribute(
          'invoiceReason', e.target.value,
        )}
        error={validator.isEmpty(props.invoiceReason)}
        style={{ margin: '0 0.5em' }}
        width="50%"
      />
      {suffix}
    </Segment>
  );
}

export default CustomInvoiceText;
