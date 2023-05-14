// styles & icons
import loading from '../../../media/icons/preLoader.svg';
import styles from './PreLoader.module.css';
import classes from '../navbar/Navbar.module.css';

// config

// hooks

// context

// components


const PreLoader = () => {

    return (
        <>
            <nav className={classes.navbar}>
                <div className={classes['nav-content-wrapper']}>
                    <h3>Logo</h3>
                </div>
            </nav>

            <div className={styles['loading-container']}>
                <img 
                    className={styles.loader}
                    src={loading} 
                    alt='loading' 
                />
                <h3>Sorry, we'll only be a second...</h3>
            </div>
        </>
    )
}

export default PreLoader;