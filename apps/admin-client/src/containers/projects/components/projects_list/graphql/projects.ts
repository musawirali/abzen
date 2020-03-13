import { gql } from 'apollo-boost';

export const PROJECT_FRAGMENT = gql`
  fragment ProjectsListProject on Project {
    id
    name
    activeExperimentsCount
    allExperimentsCount
  }
`;

export interface Project {
  id: string;
  name: string;
  activeExperimentsCount: number;
  allExperimentsCount: number;
}

export const PROJECTS_QUERY = gql`
  query ProjectsList {
    projects {
      ...ProjectsListProject
    }
  }

  ${PROJECT_FRAGMENT}
`;

export interface ProjectsQueryData {
  projects: Project[];
}