import { Box } from '@mantine/core';

const HealthyCircle = ({
  healthy,
  noMargin = false,
}: {
  healthy?: boolean;
  noMargin?: boolean;
}) => (
  <Box
    mr={noMargin ? 0 : '1rem'}
    style={{
      width: '0.75rem',
      height: '0.75rem',
      borderRadius: '50%',
      backgroundColor:
        healthy === undefined ? 'gray' : healthy ? 'green' : 'red',
      flexShrink: 0,
      flexBasis: '0.75rem',
    }}
  />
);

export default HealthyCircle;
