import { MantineProvider } from '@mantine/core';
import Router from './router';

const App = () => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}
    >
      <Router />
    </MantineProvider>
  );
};

export default App;
