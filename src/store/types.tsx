
export interface IProfile {
  id: string;
  email: string;
  interests: string[];
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