import { useQuery } from '@tanstack/react-query';
import { Client } from '../clients/server.generated';

export const generalQueryKeys = {
  base: () => ['general'],
  publicGeneralInfo: () => [...generalQueryKeys.base(), 'publicGeneralInfo'],
}

export function useGetPublicGeneralQuery() {
  const client = new Client();

  return useQuery({
    queryKey: generalQueryKeys.publicGeneralInfo(),
    retry: 0,
    queryFn: () => client.getPublicGeneralInfo(),
  });
}
