export interface IComicList {
  available?: number;
  returned?: number;
  collectionURI?: string;
  items?: Array<IComicSummary>;
};

export interface IComicSummary {
  resourceURI?: string;
  name?: string;
};
