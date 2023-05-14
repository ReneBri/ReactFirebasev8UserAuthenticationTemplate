// styles
import styles from '../../AccountSettings.module.css';

// config

// context

// hooks
import { useState } from 'react';

// components
import DisplayName from './display-name/DisplayName';
import Email from './email/Email';


const GeneralSettings = ({ displayName, email }) => {

  // This links up to the id of the input
  const [infoToChange, setInfoToChange] = useState(null);

  return (

    <div className={styles['account-settings-content']}>

        <h2>General Settings</h2>
        
        <DisplayName infoToChange={infoToChange} setInfoToChange={setInfoToChange} displayName={displayName} />
        
        <Email infoToChange={infoToChange} setInfoToChange={setInfoToChange} email={email} />

    </div>
  )
}

export default GeneralSettings;