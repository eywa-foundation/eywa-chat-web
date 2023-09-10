import { Container, Flex, Text } from '@mantine/core';
import HealthyCircle from '../../components/HealthyCircle';
import useRelayServers from '../../hooks/useRelayServers';
import { useEffect, useState } from 'react';
import useKeplr from '../../hooks/useKeplr';

const StatusPage = () => {
  const servers = useRelayServers();
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const { client, accounts } = useKeplr();

  useEffect(() => {
    const account = accounts?.[0];
    if (!account || !client || !servers.length) return;
    (async () => {
      const res = await client.CosmosBankV1Beta1.query
        .queryBalance(account.address, {
          denom: 'token',
        })
        .then(() => true)
        .catch(() => false);
      setStatus((prev) => ({ ...prev, [servers[0].value]: res }));
    })();
  }, [accounts, client, servers]);

  useEffect(() => {
    servers.slice(1).forEach(async (server) => {
      const res = await fetch(`${server.value}/health`)
        .then(() => true)
        .catch(() => false);
      setStatus((prev) => ({ ...prev, [server.value]: res }));
    });
  }, [servers]);

  return (
    <Container py="1rem">
      <Text size="1.5rem" weight="bold">
        Status Page
      </Text>
      {servers.map((server) => (
        <Flex key={server.value} align="center" justify="space-between">
          <Flex direction="column">
            <Text>{server.label}</Text>
            <Text size="0.75em">{server.value}</Text>
          </Flex>
          <HealthyCircle healthy={status[server.value]} noMargin />
        </Flex>
      ))}
    </Container>
  );
};

export default StatusPage;
