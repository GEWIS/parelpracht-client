import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Header, Input, Segment,
} from 'semantic-ui-react';
import {
  ContractFile, InvoiceFile, ProductFile,
} from '../../clients/server.generated';

export type GeneralFile = ContractFile | ProductFile | InvoiceFile;

interface Props extends RouteComponentProps {
  file?: GeneralFile;
  create: boolean;
}

class SingleFile extends React.Component<Props> {
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
          onClick={() => {
            window.location.replace(
              `/api${this.props.location.pathname}/file/${file.id}`,
            );
          }}
        />
      </Segment.Group>
    );
  }
}

export default withRouter(SingleFile);
