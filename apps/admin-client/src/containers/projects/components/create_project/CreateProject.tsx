import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { CREATE_PROJECT_MUTATION, CreateProjectMutationDataType } from './graphql/create_project';
import { Project, PROJECTS_QUERY } from '../projects_list/graphql/projects';

interface CreateProjectPropsType {
  onCreated: () => void;
}

/**
 * View for creating new project.
 */
export const CreateProject = (props: CreateProjectPropsType) => {
  const { onCreated } = props;
  const [name, setName] = useState('');

  // Login mutation and handler.
  const [createProject, { data, error, loading }] = useMutation<CreateProjectMutationDataType>(CREATE_PROJECT_MUTATION);
  useEffect(() => {
    if (data && !error && !loading) {
      onCreated();
    }
  }, [data, error, loading, onCreated]);

  // Format error message for display
  const displayError = useMemo(() => {
    if (!error) return null;
    return (error.graphQLErrors[0] || error).message;
  }, [error]);

  /**
   * Input validation.
   */
  const isValid = useMemo(() => {
    return name.trim() !== '';
  }, [name]);

  /**
   * Form submission handler.
   *
   * @param event
   */
  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }

    createProject({
      variables: {
        input: {
          name,
        },
      },
      update: (cache, { data }) => {
        if (data) {
          const { createProject } = data;
          const { project } = createProject;
          const query = PROJECTS_QUERY;

          let newProjects: Project[] = [];
          let writeCache = false;
          try {
            // This cache query can fail if the initial projects list hasn't been fetched yet.
            // In that case we don't need to add new project to cache. It will be there on the subsequent
            // project list fetch.
            const { projects } = cache.readQuery<{ projects: Project[] }>({ query }) || { projects: [] };
            newProjects = [ ...projects, project ];
            writeCache = true;
          } catch (err) {
            writeCache = false;
          }

          if (writeCache) {
            cache.writeQuery({
              query,
              data: { projects: newProjects },
            });
          }
        }
      },
    })
  }, [isValid, createProject, name]);

  return (
    <div>
      Create new project

      <div className="mt-4">
        <form onSubmit={onSubmit}>
          <div>
            <div>Title</div>
            <input
              type="text"
              value={name}
              onChange={(evt) => { setName(evt.target.value); }}
            />
          </div>

          <div>
            <button disabled={!isValid}>
              Continue
            </button>
          </div>

          { displayError &&
            <div>
              {displayError}
            </div>
          }
        </form>
      </div>
    </div>
  );
};
