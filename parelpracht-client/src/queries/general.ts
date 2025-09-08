import { useQuery } from '@tanstack/react-query';
import { getPublicGeneralInfoOptions } from '../clients/generated-client-new/@tanstack/react-query.gen';

export const generalQueryKeys = {
  base: () => ['general'],
  publicGeneralInfo: () => [...generalQueryKeys.base(), 'publicGeneralInfo'],
}

export function useGetPublicGeneralQuery() {

  return useQuery({
    ...getPublicGeneralInfoOptions(),
    retry: 1,
  })
}
