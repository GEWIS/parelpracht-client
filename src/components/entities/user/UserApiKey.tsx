import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Icon } from 'semantic-ui-react';
import { authGenerateApiKey, authGetApiKey, authRevokeApiKey } from '../../../stores/auth/actionCreators';
import ResourceStatus from '../../../stores/resourceStatus';
import { RootState } from '../../../stores/store';

interface Props {
  hasApiKey: boolean | undefined;
  apiKey: string | undefined;
  apiKeyStatus: ResourceStatus,

  getApiKey: () => void,
  generateApiKey: () => void,
  revokeApiKey: () => void,
}

function UserApiKey(props: Props) {
  const {
    hasApiKey, apiKey, apiKeyStatus, getApiKey,
    generateApiKey, revokeApiKey,
  } = props;

  if (hasApiKey) {
    return (
      <>
        { apiKey === undefined ? (
          <Button
            onClick={getApiKey}
            loading={apiKeyStatus === ResourceStatus.FETCHING}
          >
            <Icon name="eye" />
            View Key
          </Button>
        ) : (
          <span>
            <b style={{ marginRight: '1rem' }}>
              ApiKey
              {' '}
              {apiKey}
            </b>
          </span>
        )}
        <Button
          onClick={revokeApiKey}
          loading={apiKeyStatus === ResourceStatus.DELETING}
        >
          <Icon name="times" />
          Revoke
        </Button>
      </>
    );
  }
  return (
    <Button
      onClick={generateApiKey}
      loading={apiKeyStatus === ResourceStatus.FETCHING}
    >
      <Icon name="refresh" />
      Generate
    </Button>
  );
  return (
    <div>
      {hasApiKey}
      {' '}
      {apiKey}
      {' '}
      {apiKeyStatus}
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    hasApiKey: state.auth.profile?.hasApiKey,
    apiKey: state.auth.apiKey,
    apiKeyStatus: state.auth.apiKeyRequest,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getApiKey: () => dispatch(authGetApiKey()),
  generateApiKey: () => dispatch(authGenerateApiKey()),
  revokeApiKey: () => dispatch(authRevokeApiKey()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserApiKey);
