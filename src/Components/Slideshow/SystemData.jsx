import { Text } from '@mantine/core';
import classes from '../../style/Test.module.css';
import { Link } from 'react-router-dom';

export default function SystemData({ folderCount, screenCount, slideCount }) {
  return (
    <div className={classes.root}>
      <div className={classes.stat}>
        <Text className={classes.count}>{slideCount}</Text>
        <Text className={classes.title}>Slaidi</Text>
        <Text className={classes.description}>Šodienas slaidu skaits</Text>
      </div>
      <div className={classes.stat}>
        <Link to="/dashboard/view">
          <Text className={classes.count}>{folderCount}</Text>
          <Text className={classes.title}>Mapes</Text>
          <Text className={classes.description}>Kopējais mapju skaits</Text>
          </Link>
      </div>
      <div className={classes.stat}>
        <Link to="/dashboard/selectScreen">
        <Text className={classes.count}>{screenCount}</Text>
        <Text className={classes.title}>Ekrāni</Text>
        <Text className={classes.description}>Kopējais ekrānu skaits</Text>
        </Link>
      </div>
    </div>
  );
}
