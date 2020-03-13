import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import map from 'lodash/map';

import { PROJECTS_QUERY, ProjectsQueryData } from './graphql/projects';

export interface BasicInfo {
  name: string;
  projectID: number | null;
}
interface BasicsPropsType {
  data: BasicInfo | null;
  onNext: (data: BasicInfo) => void;
  onCancel: () => void;
}

export const Basics = (props: BasicsPropsType) => {
  const { data, onNext, onCancel } = props;
  const [name, setName] = useState(data?.name || '');
  const [projectID, setProjectID] = useState(`${data?.projectID || ''}`);

  // Query to fetch the projects list.
  const queryRes = useQuery<ProjectsQueryData>(PROJECTS_QUERY);
  const projects = useMemo(() => {
    if (queryRes.data && !queryRes.error && !queryRes.loading) {
      return queryRes.data.projects;
    }
    return [];
  }, [queryRes]);

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

    onNext({
      name: name.trim(),
      projectID: projectID ? parseInt(projectID, 10) : null,
    });
  }, [isValid, onNext, name, projectID]);

  return (
    <div>
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
          <div>Project</div>
          <select
            disabled={queryRes.loading}
            onChange={(evt) => { setProjectID(evt.target.value); }}
            value={projectID}
          >
            {/* While the project list is being loaded, we show this disabled option */}
            { queryRes.loading && <option>Loading...</option>}

            {/* If loading finished, show the project list */}
            { !queryRes.loading && <option value="">--- No Project ---</option>}
            { !queryRes.loading && map(projects, proj =>
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            )}
          </select>
        </div>

        <div>
          <button disabled={!isValid}>
            Continue
          </button>
          <button type="button" onClick={() => { onCancel(); }}>
            Cancel & delete
          </button>
        </div>
      </form>
    </div>
  );
};
