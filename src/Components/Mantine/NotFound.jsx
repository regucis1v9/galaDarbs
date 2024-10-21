import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from '../../style/NotFound.module.css';
import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Tu atradi slepenu lapu.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Diemžēl, šī ir tikai 404 lapa. Tu visiticamāk nepareizi uzrakstiji saiti, vai lapa tika dzēsta.
      </Text>
      <Group justify="center">
        <Link to="/">
        <Button variant="subtle" size="md">
          Atpakaļ uz sākumu
        </Button>
        </Link>
      </Group>
    </Container>
  );
}