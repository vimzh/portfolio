export type Project = {
  title: string;
  description: string;
  period?: string;
  tags: string[];
  image: string;
  imageAlt: string;
  link: string;
  repo?: string;
};

export type Contribution = {
  owner: string;
  repo: string;
  stars: string;
  description: string;
  status: string;
  link: string;
};
