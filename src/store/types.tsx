
export interface IProfile {
  id: string;
  email: string;
  interests: string[];
}

export interface ISearchResult {
  articles: IArticleCard[],
  summarize: string
}

export interface IArticle {
  id: string;
  title: string;
  tags: string[];
  creation_date: Date;
  source: string
  text: string
}

export interface IArticleCard {
  source: string
  id: string;
  title: string;
  summary: string;
  tags: string[];
  creation_date: Date;
}