import React, { SyntheticEvent } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Dropdown, DropdownProps, Form } from 'semantic-ui-react';
import COUNTRY_OPTIONS from './countries.json';

interface Country {
  key: string,
  value: string,
  flag: string,
  text: string,
}

interface Props extends WithTranslation {
  editing: boolean;
  country: string;
  updateValue: (e: SyntheticEvent<HTMLElement>, data: DropdownProps) => void;
  id: string;
}

class CountrySelector extends React.Component<Props> {
  private readonly countries: Country[];

  constructor(props: Props) {
    super(props);
    this.countries = COUNTRY_OPTIONS;
  }

  render() {
    const { t } = this.props;
    return (
      <Form.Field
        disabled={!this.props.editing}
      >
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor={this.props.id}>
          {t('entities.company.props.country')}
        </label>
        <Dropdown
          id={this.props.id}
          placeholder={t('entities.company.props.country')}
          fluid
          search
          selection
          clearable
          options={this.countries}
          value={this.props.country}
          lazyLoad
          onChange={(e, data) => this.props.updateValue(e, data)}
        />
      </Form.Field>
    );
  }
}

export default withTranslation()(CountrySelector);
