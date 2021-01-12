import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Header, Input, Segment,
} from 'semantic-ui-react';
import {
  ContractFile, InvoiceFile, ProductFile,
} from '../../clients/server.generated';
// eslint-disable-next-line import/no-cycle
import { FilesClient } from '../../clients/filesClient';

export type GeneralFile = ContractFile | ProductFile | InvoiceFile;

interface Props extends RouteComponentProps {
  file?: GeneralFile;
  create: boolean;

  entityId?: number;
}

class SingleFile extends React.Component<Props> {
  private async getFile() {
    const {
      entityId, file,
    } = this.props;

    const client = new FilesClient();
    await client.getContractFile(entityId!, file!);
  }

  public render() {
    if (this.props.create) {
      return (
        <Segment.Group
          horizontal
          className="single-file"
          style={{ margin: 0, marginTop: '0.2em' }}
        >
          <Segment
            as={Button}
            textAlign="left"
          >
            <Header sub>
              <Header.Content>
                <Input placeholder="Filename" />
              </Header.Content>
            </Header>
          </Segment>
        </Segment.Group>
      );
    }
    const { file } = this.props;
    if (file === undefined) {
      return null;
    }
    return (
      <Segment.Group
        horizontal
        className="single-file"
        style={{ margin: 0, marginTop: '0.2em' }}
      >
        <Segment
          as={Button}
          textAlign="left"
        >
          <Header sub>
            <Header.Content>
              {file.name}
              <Header.Subheader>
                {file.createdAt.toLocaleDateString()}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Button
          icon="download"
          attached="right"
          basic
          onClick={() => this.getFile()}
        />
      </Segment.Group>
    );
  }
}

export default withRouter(SingleFile);
