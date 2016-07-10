import AppsManager    from 'lib/AppsManager';
import Dropdown       from 'components/Dropdown/Dropdown.react';
import DropdownOption from 'components/Dropdown/Option.react';
import Field          from 'components/Field/Field.react';
import FormModal      from 'components/FormModal/FormModal.react';
import FormNote       from 'components/FormNote/FormNote.react';
import history        from 'dashboard/history';
import Icon           from 'components/Icon/Icon.react';
import Label          from 'components/Label/Label.react';
import Modal          from 'components/Modal/Modal.react';
import React          from 'react';
import SliderWrap     from 'components/SliderWrap/SliderWrap.react';
import styles         from './NewAppDialog.scss';
import TextInput      from 'components/TextInput/TextInput.react';
import { get }        from 'lib/AJAX';
import { Link }       from 'react-router';
import { Promise }    from 'parse';
import AdminApp       from './../AdminApp';

const SHOW_NEW_APP_FORM_CONNECTION_STRING = false;

export default class NewAppDialog extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      databaseType: 'parse',
      connectionURL: '',
      connectionWarnings: [],
      showConnectionValidationErrors: true,
    };
  }

  createApp() {
    // ! TODO: custom connection string ???
    AdminApp.setParseKeys();
    return AdminApp.apiRequest('POST', 'apps', { appName: this.state.name })
      .then((data) => {
        const app = data.app;
        return app.slug;
      })
      .then((slug) => {
        return AdminApp.apiRequest('GET', 'apps', {})
          .then((data) => {
            const apps = data.results;
            this.props.processApps(apps);
            return slug;
          });
      })
      .fail(this.props.onAuthError);
      return;
  }

  render() {
    let needsConnectionString = this.state.databaseType == 'custom';
    let hasValidName = this.state.name.length > 0 && !AppsManager.findAppByName(this.state.name);
    let valid = hasValidName && (!needsConnectionString || this.state.connectionURL);

    let customDBWarning = this.state.databaseType === 'custom' ? <FormNote
      show={this.state.databaseType === 'custom'}
      color='orange'>
      <Icon name='warn-solid' width={12} height={12} fill="white"/> Important: You will not be able to change the database type after creation.
    </FormNote> : null;
    let URLfield =
    <SliderWrap
      expanded={this.state.databaseType === 'custom'}>
      <Field
        label={<Label
          text='Destination detabase'
          description='Enter a MongoDB connection URL'/>
        }
        input={<TextInput
          placeholder='mongodb://...'
          value={this.state.connectionURL}
          onChange={url => this.setState({
            connectionURL: url,
            connectionWarnings: [],
          })}/>
        }/>
    </SliderWrap>;
    let mongoURLField = SHOW_NEW_APP_FORM_CONNECTION_STRING ? [
      <Field
        label={<Label
          text='Database Type'
          description={<span><Link to='#'>Learn more</Link> about database types</span>} />}
        input={
          <Dropdown
            fixed={true}
            onChange={value => this.setState({databaseType: value})}
            value={this.state.databaseType} >
            <DropdownOption value={'parse'}>
              <div className={styles.option}>
                <div>Parse Data</div>
                <div className={styles.optionDescription}>Let Parse manage your database for you.</div>
              </div>
            </DropdownOption>
            <DropdownOption value={'custom'}>
              <div className={styles.option}>
                <div>Custom <span className={styles.optionTitleNote}>(expert)</span></div>
                <div className={styles.optionDescription}>Provide your own database endpoint.</div>
              </div>
            </DropdownOption>
          </Dropdown>
        }
      />,
      customDBWarning,
      URLfield,
    ] : null;
    return (
      <FormModal
        title='Create a new app'
        width={this.state.databaseType === 'parse' ? 600 : 900}
        open={this.props.open}
        onSubmit={this.createApp.bind(this)}
        showErrors={this.state.showConnectionValidationErrors}
        onClose={this.props.onCancel}
        icon='blank-app-outline'
        iconSize={30}
        subtitle='Just give it a name first&hellip;'
        submitText={this.state.connectionWarnings && this.state.connectionWarnings.length > 0 ? 'Make it anyway' : 'Make it!'}
        inProgressText={'Making it\u2026'}
        onSuccess={({ slug }) => history.pushState(null, `/apps/${slug}/browser`)}
        clearFields={() => this.setState({
          name: '',
          connectionURL: '',
          connectionWarnings: [],
        })}
        enabled={valid}>
        <Field
          label={
            <Label
              text='App Name'
              description={'This is how we\u2019ll reference it.'} />
          }
          input={
            <TextInput
              placeholder={'Pick a good name\u2026'}
              value={this.state.name}
              onChange={name => this.setState({ name: name })} />
          } />
          {mongoURLField}
          {this.state.connectionWarnings.map(warning => <FormNote key={warning}show={true} color='orange'>{warning}</FormNote>)}
      </FormModal>
    );
  }
}
