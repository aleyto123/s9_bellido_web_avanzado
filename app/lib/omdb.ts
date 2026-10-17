export interface Movie {
  imdbID: string; Title: string; Year: string; Type: string; Poster: string;
  Plot?: string; Genre?: string; Runtime?: string; Rated?: string; Released?: string;
  Director?: string; Writer?: string; Actors?: string; Language?: string; Country?: string;
  Awards?: string; imdbRating?: string; imdbVotes?: string; BoxOffice?: string;
  totalSeasons?: string; Ratings?: { Source: string; Value: string }[];
}
export interface SearchResponse { Response: string; Search?: Movie[]; totalResults?: string; Error?: string }
