import {
  CompanyFile, ContractFile, InvoiceFile, ProductFile,
} from '../../clients/server.generated';

export type GeneralFile = ContractFile | ProductFile | InvoiceFile | CompanyFile;
