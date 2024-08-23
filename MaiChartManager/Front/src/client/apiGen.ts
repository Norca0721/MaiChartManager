/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Chart {
  path?: string | null;
  /** @format int32 */
  level?: number;
  /** @format int32 */
  levelDecimal?: number;
  /** @format int32 */
  levelId?: number;
  /** @format int32 */
  maxNotes?: number;
  enable?: boolean;
  designer?: string | null;
}

export interface GenreXml {
  assetDir?: string | null;
  /** @format int32 */
  id?: number;
  filePath?: string | null;
  genreName?: string | null;
  genreNameTwoLine?: string | null;
  /** @format int32 */
  colorR?: number;
  /** @format int32 */
  colorG?: number;
  /** @format int32 */
  colorB?: number;
}

export interface MusicBrief {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  nonDxId?: number;
  name?: string | null;
  hasJacket?: boolean;
  modified?: boolean;
}

export interface MusicXml {
  filePath?: string | null;
  /** @format int32 */
  id?: number;
  /** @format int32 */
  nonDxId?: number;
  modified?: boolean;
  name?: string | null;
  /** @format int32 */
  genreId?: number;
  /** @format int32 */
  addVersionId?: number;
  artist?: string | null;
  /** @format int32 */
  version?: number;
  /** @format int32 */
  bpm?: number;
  disable?: boolean;
  charts?: Chart[] | null;
  hasJacket?: boolean;
}

export interface VersionXml {
  assetDir?: string | null;
  /** @format int32 */
  id?: number;
  filePath?: string | null;
  genreName?: string | null;
  genreNameTwoLine?: string | null;
  /** @format int32 */
  colorR?: number;
  /** @format int32 */
  colorG?: number;
  /** @format int32 */
  colorB?: number;
  /** @format int32 */
  version?: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title MaiChartManager
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags AddVersion
     * @name GetAllAddVersions
     * @request GET:/api/AddVersion/GetAllAddVersions
     */
    GetAllAddVersions: (params: RequestParams = {}) =>
      this.request<VersionXml[], any>({
        path: `/api/AddVersion/GetAllAddVersions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartLevel
     * @request POST:/api/Chart/EditChartLevel/{id}/{level}
     */
    EditChartLevel: (id: number, level: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Chart/EditChartLevel/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartLevelDisplay
     * @request POST:/api/Chart/EditChartLevelDisplay/{id}/{level}
     */
    EditChartLevelDisplay: (id: number, level: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Chart/EditChartLevelDisplay/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartLevelDecimal
     * @request POST:/api/Chart/EditChartLevelDecimal/{id}/{level}
     */
    EditChartLevelDecimal: (id: number, level: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Chart/EditChartLevelDecimal/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartDesigner
     * @request POST:/api/Chart/EditChartDesigner/{id}/{level}
     */
    EditChartDesigner: (id: number, level: number, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Chart/EditChartDesigner/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartNoteCount
     * @request POST:/api/Chart/EditChartNoteCount/{id}/{level}
     */
    EditChartNoteCount: (id: number, level: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Chart/EditChartNoteCount/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Chart
     * @name EditChartEnable
     * @request POST:/api/Chart/EditChartEnable/{id}/{level}
     */
    EditChartEnable: (id: number, level: number, data: boolean, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Chart/EditChartEnable/${id}/${level}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Genre
     * @name GetAllGenres
     * @request GET:/api/Genre/GetAllGenres
     */
    GetAllGenres: (params: RequestParams = {}) =>
      this.request<GenreXml[], any>({
        path: `/api/Genre/GetAllGenres`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name GetMusicDetail
     * @request GET:/api/Music/GetMusicDetail/{id}
     */
    GetMusicDetail: (id: number, params: RequestParams = {}) =>
      this.request<MusicXml, any>({
        path: `/api/Music/GetMusicDetail/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicName
     * @request POST:/api/Music/EditMusicName/{id}
     */
    EditMusicName: (id: number, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Music/EditMusicName/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicArtist
     * @request POST:/api/Music/EditMusicArtist/{id}
     */
    EditMusicArtist: (id: number, data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Music/EditMusicArtist/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicBpm
     * @request POST:/api/Music/EditMusicBpm/{id}
     */
    EditMusicBpm: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Music/EditMusicBpm/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicVersion
     * @request POST:/api/Music/EditMusicVersion/{id}
     */
    EditMusicVersion: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Music/EditMusicVersion/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicGenre
     * @request POST:/api/Music/EditMusicGenre/{id}
     */
    EditMusicGenre: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Music/EditMusicGenre/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name EditMusicAddVersion
     * @request POST:/api/Music/EditMusicAddVersion/{id}
     */
    EditMusicAddVersion: (id: number, data: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Music/EditMusicAddVersion/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name SaveMusic
     * @request POST:/api/Music/SaveMusic/{id}
     */
    SaveMusic: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Music/SaveMusic/${id}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Music
     * @name GetJacket
     * @request GET:/api/Music/GetJacket/{id}
     */
    GetJacket: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Music/GetJacket/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name SetAssetsDir
     * @request POST:/api/MusicList/SetAssetsDir
     */
    SetAssetsDir: (data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/MusicList/SetAssetsDir`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name GetAssetsDirs
     * @request GET:/api/MusicList/GetAssetsDirs
     */
    GetAssetsDirs: (params: RequestParams = {}) =>
      this.request<string[], any>({
        path: `/api/MusicList/GetAssetsDirs`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name GetSelectedAssetsDir
     * @request GET:/api/MusicList/GetSelectedAssetsDir
     */
    GetSelectedAssetsDir: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/MusicList/GetSelectedAssetsDir`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MusicList
     * @name GetMusicList
     * @request GET:/api/MusicList/GetMusicList
     */
    GetMusicList: (params: RequestParams = {}) =>
      this.request<MusicBrief[], any>({
        path: `/api/MusicList/GetMusicList`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
