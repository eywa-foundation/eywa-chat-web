import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Router from './router';

const App = () => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <Notifications />
      <Router />
    </MantineProvider>
  );
};

export default App;
