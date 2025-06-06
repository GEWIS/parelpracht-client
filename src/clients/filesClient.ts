import FileSaver from 'file-saver';
import { SingleEntities } from '../stores/single/single';
import { CustomInvoiceGenSettings, GenerateContractParams, GenerateInvoiceParams } from './server.generated';

export class FilesClient {
  private readonly http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };

  private readonly baseUrl: string;

  constructor(
    baseUrl?: string,
    http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> },
  ) {
    this.http = http || <any>window;
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : '/api';
  }

  private getBaseUrl(entity: SingleEntities): string {
    switch (entity) {
      case SingleEntities.Contract: return `${this.baseUrl}/contract/{id}`;
      case SingleEntities.Invoice: return `${this.baseUrl}/invoice/{id}`;
      case SingleEntities.Product: return `${this.baseUrl}/product/{id}`;
      case SingleEntities.Company: return `${this.baseUrl}/company/{id}`;
      case SingleEntities.User: return `${this.baseUrl}/user/{id}`;
      default: throw new Error(`${entity} does not support files`);
    }
  }

  getFile(
    entityId: number, fileId: number, entity: SingleEntities,
  ): Promise<any> {
    let url = `${this.getBaseUrl(entity)}/file/{fileId}`;

    if (entityId === undefined || entityId === null) throw new Error("The parameter 'id' must be defined.");
    url = url.replace('{id}', encodeURIComponent(`${entityId}`));
    if (fileId === undefined || fileId === null) throw new Error("The parameter 'fileId' must be defined.");
    url = url.replace('{fileId}', encodeURIComponent(`${fileId}`));
    url = url.replace(/[?&]$/, '');

    const options = <RequestInit>{
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };

    return this.http.fetch(url, options).then((response: Response) => {
      return this.processGetGeneralFile(response);
    });
  }

  private async processGetGeneralFile(response: Response): Promise<boolean> {
    const { status } = response;
    const headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach((v: any, k: any) => { headers[k] = v; });
    }

    let filename = '';
    if (headers['content-disposition'] && headers['content-disposition'].indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(headers['content-disposition']);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    if (status === 200) {
      FileSaver.saveAs(await response.blob(), filename);
      return true;
    }
    return false;
  }

  async uploadFile(
    entityId: number, file: FormData, entity: SingleEntities,
  ): Promise<boolean> {
    let url = `${this.getBaseUrl(entity)}/file/upload`;

    if (entityId === undefined || entityId === null) throw new Error("The parameter 'id' must be defined.");
    url = url.replace('{id}', encodeURIComponent(`${entityId}`));
    url = url.replace(/[?&]$/, '');

    if (file === null || file === undefined) throw new Error("The parameter 'file' cannot be null.");

    const options = <RequestInit>{
      body: file,
      method: 'POST',
    };

    return this.http.fetch(url, options).then((response: Response) => {
      return this.processUploadFile(response);
    });
  }

  async uploadLogo(
    entityId: number, file: FormData, entity: SingleEntities,
  ): Promise<boolean> {
    let url = `${this.getBaseUrl(entity)}/logo`;

    if (entityId === undefined || entityId === null) throw new Error("The parameter 'id' must be defined.");
    url = url.replace('{id}', encodeURIComponent(`${entityId}`));
    url = url.replace(/[?&]$/, '');

    if (file === null || file === undefined) throw new Error("The parameter 'file' cannot be null.");

    const options = <RequestInit>{
      body: file,
      method: 'PUT',
    };

    return this.http.fetch(url, options).then((response: Response) => {
      return this.processUploadFile(response);
    });
  }

  async uploadBackground(
    entityId: number, file: FormData, entity: SingleEntities,
  ): Promise<boolean> {
    let url = `${this.getBaseUrl(entity)}/background`;

    if (entityId === undefined || entityId === null) throw new Error("The parameter 'id' must be defined.");
    url = url.replace('{id}', encodeURIComponent(`${entityId}`));
    url = url.replace(/[?&]$/, '');

    if (file === null || file === undefined) throw new Error("The parameter 'file' cannot be null.");

    const options = <RequestInit>{
      body: file,
      method: 'PUT',
    };

    return this.http.fetch(url, options).then((response: Response) => {
      return this.processUploadFile(response);
    });
  }

  private processUploadFile(response: Response): boolean {
    return response.status === 200 || response.status === 204;
  }

  generateContractFile(contractId: number, body: GenerateContractParams): Promise<boolean> {
    let url = `${this.baseUrl}/contract/{id}/file/generate`;
    if (contractId === undefined || contractId === null) throw new Error("The parameter 'id' must be defined.");
    url = url.replace('{id}', encodeURIComponent(`${contractId}`));
    url = url.replace(/[?&]$/, '');

    const options = {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    } as RequestInit;

    return this.http.fetch(url, options).then((response: Response) => {
      return this.processGetGeneralFile(response);
    });
  }

  generateInvoiceFile(invoiceId: number, body: GenerateInvoiceParams): Promise<boolean> {
    let url = `${this.baseUrl}/invoice/{id}/file/generate`;
    if (invoiceId === undefined || invoiceId === null) throw new Error("The parameter 'id' must be defined.");
    url = url.replace('{id}', encodeURIComponent(`${invoiceId}`));
    url = url.replace(/[?&]$/, '');

    const options = {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    } as RequestInit;

    return this.http.fetch(url, options).then((response: Response) => {
      return this.processGetGeneralFile(response);
    });
  }

  generateCustomInvoiceFile(body: CustomInvoiceGenSettings): Promise<boolean> {
    let url = `${this.baseUrl}/invoice/custom`;
    url = url.replace(/[?&]$/, '');

    const options = {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    } as RequestInit;

    return this.http.fetch(url, options).then((response: Response) => {
      return this.processGetGeneralFile(response);
    });
  }
}
