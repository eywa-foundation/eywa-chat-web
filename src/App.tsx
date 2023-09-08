import { MantineProvider } from '@mantine/core';
import Router from './router';

const App = () => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Router />
    </MantineProvider>
  );
};

export default App;
