// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export interface IHttp {
  get<T, U>(
    url: string,
    requestParams?: T,
    config?: Partial<IHTTPConfig>
  ): Promise<U>;
  put<T, U>(url: string, data: T, config?: Partial<IHTTPConfig>): Promise<U>;
  post<T, U>(url: string, data: T, config?: Partial<IHTTPConfig>): Promise<U>;
  delete<T, U>(url: string, data: T, config?: Partial<IHTTPConfig>): Promise<U>;
  patch<T, U>(url: string, data: T, config?: Partial<IHTTPConfig>): Promise<U>;
}

const ua =
  typeof navigator !== 'undefined' ? navigator.userAgent : 'StandardUA';

const defaultHeaders = {
  'X-User-Agent': `${ua} Xflow website`,
  'Content-Type': 'application/json',
};

export interface IHTTPConfig {
  credentials: RequestCredentials;
  redirect: RequestRedirect;
  headers: { [key: string]: string };
  formData: FormData;
  appSpecificTags?: { [key: string]: string | number | boolean };
}

function request<T>(res: Response): Promise<T> {
  return Promise.resolve(res)
    .then((response) => {
      const contentType = response.headers.get('content-type');
      const isContentTypeJson =
        contentType && contentType.indexOf('application/json') !== -1;
      if (response.ok) {
        if (isContentTypeJson) {
          return Promise.resolve(response.json());
        }
        const contentDisposition = response.headers.get('content-disposition');
        if (
          contentDisposition &&
          contentDisposition.indexOf('attachment') !== -1
        ) {
          const [, filename] = contentDisposition
            .split('filename=')[1]
            .split('"');
          return response.blob().then((blob: Blob) => {
            return Promise.resolve({
              status: response.status,
              response: { file: blob, name: filename },
            });
          });
        }
        return Promise.resolve(response.text());
      }
      if (isContentTypeJson) {
        return response
          .json()
          .then((error) =>
            Promise.reject({ status: response.status, response: error })
          );
      }
      return response
        .text()
        .then((error) =>
          Promise.reject({ status: response.status, response: error })
        );
    })
    .catch((error) => {
      return Promise.reject({ status: error.status, response: error });
    });
}

function fireRequest<T>(
  url: string,
  config: Partial<IHTTPConfig> = {}
): Promise<T> {
  const conf = {
    ...config,
    headers: {
      ...defaultHeaders,
      ...config.headers,
    },
  };

  // if (conf.headers['Content-Type'] === undefined) {
  //   delete conf.headers['Content-Type'];
  // }

  return fetch(url, conf).then(request);
}

const http = {
  get<U>(url: string, config: RequestInit = {}): Promise<U> {
    return fireRequest<U>(
      url,
      Object.assign(
        {
          method: 'get',
        },
        config
      )
    );
  },
  put<T, U>(
    url: string,
    data: T,
    config: Partial<IHTTPConfig> = {}
  ): Promise<U> {
    return fireRequest<U>(
      url,
      Object.assign(
        {
          method: 'put',
          body: config.fileStream ? config.fileStream : JSON.stringify(data),
        },
        config
      )
    );
  },
  post<T, U>(
    url: string,
    data: T,
    config: Partial<IHTTPConfig> = {}
  ): Promise<U> {
    return fireRequest<U>(
      url,
      Object.assign(
        {
          method: 'post',
          body: !!config.formData ? config.formData : JSON.stringify(data),
        },
        config
      )
    );
  },
  delete<T, U>(
    url: string,
    data: T,
    config: Partial<IHTTPConfig> = {}
  ): Promise<U> {
    return fireRequest<U>(
      url,
      Object.assign(
        {
          method: 'delete',
          body: JSON.stringify(data),
        },
        config
      )
    );
  },
  patch<T, U>(
    url: string,
    data: T,
    config: Partial<IHTTPConfig> = {}
  ): Promise<U> {
    return fireRequest<U>(
      url,
      Object.assign(
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        },
        config
      )
    );
  },
};

export default http;
