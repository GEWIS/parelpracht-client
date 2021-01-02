import React from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon,
} from 'semantic-ui-react';
import { RootState } from '../../stores/store';
import SingleFile, { GeneralFile } from './SingleFile';

interface Props extends RouteComponentProps {
  files: GeneralFile[];
}

interface State {

}

class FilesList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { files } = this.props;
    return (
      <>
        <h3>
          Files
          <Button
            icon
            labelPosition="left"
            floated="right"
            style={{ marginTop: '-0.5em' }}
            basic
            // TODO
            // onClick={() => }
          >
            <Icon name="plus" />
            Add File
          </Button>
        </h3>
        {files.map((file) => (
          <SingleFile key={file.id} file={file} create={false} />
        ))}
        <SingleFile create />
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = () => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilesList));
