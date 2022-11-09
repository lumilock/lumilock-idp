import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '../../components';

import Logo from '../../assets/images/Logo.svg';
import styles from './NotFound.module.scss';

function NotFound() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className={styles?.Root}>
      <div className={styles?.Box}>
        <img src={Logo} alt="" />
        <Typography variant="h1">404 Not found</Typography>
        <Typography variant="subtitle1" color="content3">Vous vous êtes égaré, cette page n&apos;existe pas, vous pouvez retourner sur le site en cliquant sur le bouton si dessous</Typography>
        <Button
          variant="contained"
          color="main"
          startIcon={IoIosArrowRoundBack}
          className={styles.Link}
          onClick={handleClick}
        >
          Retourner

        </Button>
      </div>
    </div>
  );
}

export default React.memo(NotFound);
