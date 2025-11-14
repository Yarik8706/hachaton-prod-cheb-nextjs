
export interface IProfile {
  id: string;
  username: string;
  address: string;
}

export interface ISearchResult {
  articles: IArticle[],
  summarize: string
}

export interface IArticle {
  id: string;
  title: string;
  tags: string[];
  image: string;
  onDateCreated: Date;
  articleText: string;
}