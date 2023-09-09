import { useEffect, useState } from 'react';
import useKeplr from './useKeplr';

const useRelayServers = () => {
  const { client } = useKeplr();
  const [relayServers, setRelayServers] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (!client) return;
    (async () => {
      const relayServers = await client.EywaEywa.query.queryGetRelayServer();
      const servers = [
        {
          value: 'cosmos',
          label: 'Cosmos Network',
        },
        ...(relayServers.data.relayServer?.map((server) => ({
          value: server.location ?? '',
          label: server.nickname ?? '',
        })) ?? []),
      ];
      setRelayServers(servers);
    })();
  }, [client]);

  return relayServers;
};

export default useRelayServers;
