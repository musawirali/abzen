import { gql } from 'apollo-boost';

export const PROJECT_FRAGMENT = gql`
  fragment CreateExperimentBasicProjectsListProject on Project {
    id
    name
  }
`;

export interface Project {
  id: number;
  name: string;
}

export const PROJECTS_QUERY = gql`
  query CreateExperimentBasicProjectsList {
    projects {
      ...CreateExperimentBasicProjectsListProject
    }
  }

  ${PROJECT_FRAGMENT}
`;

export interface ProjectsQueryData {
  projects: Project[];
}