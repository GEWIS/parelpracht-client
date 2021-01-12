import FileSaver from 'file-saver';
import { FileParameter, GenerateContractParams, ProductFile } from './server.generated';
// eslint-disable-next-line import/no-cycle
import { GeneralFile } from '../components/Files/SingleFile';

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

  private getFile(templateUrl: string, entityId: number, fileId: number): Promise<any> {
    let url = templateUrl;
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

  async processGetGeneralFile(response: Response) {
    const { status } = response;
    const headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach((v: any, k: any) => { headers[k] = v; });
    }

    console.log(headers);

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
    }
  }

  postUploadProductFile(productId: number, file: FileParameter, name: string) {
    let url = `${this.baseUrl}/product/${productId}/file/upload`;
    url = url.replace(/[?&]$/, '');

    const content = new FormData();
    if (file === null || file === undefined) throw new Error("The parameter 'file' cannot be null.");
    else content.append('file', file.data, file.fileName ? file.fileName : 'file');
    if (name === null || name === undefined) throw new Error("The parameter 'name' cannot be null.");
    else content.append('name', name.toString());

    const options = <RequestInit>{
      body: content,
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    };

    /* return this.http.fetch(url, options).then((response: Response) => {
      // return this.processUploadFile(response);
    }); */
  }

  generateContractFile(contractId: number, body: GenerateContractParams): Promise<void> {
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

  getProductFile(productId: number, file: GeneralFile): Promise<any> {
    const url = `${this.baseUrl}/product/{id}/file/{fileId}`;
    return this.getFile(url, productId, file.id);
  }

  async getContractFile(contractId: number, file: GeneralFile): Promise<void> {
    const url = `${this.baseUrl}/contract/{id}/file/{fileId}`;
    return this.getFile(url, contractId, file.id);
  }
}
