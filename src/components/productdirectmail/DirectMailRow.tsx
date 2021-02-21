import * as React from 'react';
import { Table } from 'semantic-ui-react';
import { DirectMail } from '../../clients/server.generated';

interface Props {
  directmail: DirectMail;
  price: number;
}

function DirectMailRow(props: Props) {
  const { directmail, price } = props;
  const { generation, students } = directmail;

  return (
    <Table.Row>
      <Table.Cell>
        {generation}
      </Table.Cell>
      <Table.Cell>
        {students}
      </Table.Cell>
      <Table.Cell>
        {students * price}
      </Table.Cell>
    </Table.Row>
  );
}

export default DirectMailRow;
