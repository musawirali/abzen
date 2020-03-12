import { gql } from 'apollo-boost';
import { PROJECT_FRAGMENT, Project } from '../../projects_list/graphql/projects';

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      project {
        ...ProjectsListProject 
      }
    }
  }

  ${PROJECT_FRAGMENT}
`;

export interface CreateProjectMutationDataType {
  createProject: {
    project: Project,
  },
}