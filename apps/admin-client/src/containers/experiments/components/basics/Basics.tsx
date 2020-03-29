import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { MutationResult } from '@apollo/react-common';
import map from 'lodash/map';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


import { PROJECTS_QUERY, ProjectsQueryData } from './graphql/projects';

export interface BasicInfo {
  name: string;
  info: string | null;
  projectID: string | null;
}
interface BasicsPropsType {
  data: BasicInfo | null;
  onNext: (data: BasicInfo) => void;
  onCancel?: () => void;
  updateRes?: MutationResult;
}

export const Basics = (props: BasicsPropsType) => {
  const { data, onNext, onCancel, updateRes } = props;

  const [name, setName] = useState(data?.name || '');
  const [info, setInfo] = useState(data?.info || '')
  const [projectID, setProjectID] = useState(data?.projectID || '');

  /**
   * Using the `onCancel` prop to determine if we're editing or creating.
   */
  const isEditing = useMemo(() => !onCancel, [onCancel]);

  /**
   * Reset the state with the original data.
   * (Used during editing).
   */
  const reset = useCallback(() => {
    setName(data?.name || '');
    setInfo(data?.info || '');
    setProjectID(data?.projectID || '');
  }, [data, setName, setInfo, setProjectID]);

  // Reload original data when it changes.
  useEffect(() => {
    if (isEditing) {
      reset();
    }
  }, [reset, isEditing]);


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
    return name.trim() !== '' && info.trim() !== '';
  }, [name, info]);

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
      info: info.trim(),
      projectID: projectID || null,
    });
  }, [isValid, onNext, name, info, projectID]);

  /**
   * Check to see if there have been any changes from original data.
   */
  const hasChanges = useMemo(() => {
    // Check name
    if (data?.name.trim() !== name.trim()) {
      return true;
    }

    // Check info
    if (data.info?.trim() !== info.trim()) {
      if (data.info !== null || info.trim().length > 0) {
        return true;
      }
    }

    // Check project ID
    return data.projectID !== projectID;
  }, [data, name, info, projectID]);

  /**
   * Compute save button title
   */
  const saveBtnTitle = useMemo(() => {
    if (!isEditing) {
      return 'Continue';
    }
    return updateRes?.loading ? 'Saving...' : 'Save';
  }, [isEditing, updateRes]);

  /**
   * Format error message for display
   */
  const displayError = useMemo(() => {
    if (!updateRes?.error) return null;
    return (updateRes.error.graphQLErrors[0] || updateRes.error).message;
  }, [updateRes]);

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={name} onChange={(evt) => { setName(evt.target.value); }} placeholder="e.g. Landing page title change" />
          <Form.Text className="text-muted">
            What should your test be called?
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" value={info} onChange={(evt) => { setInfo(evt.target.value); }} placeholder="e.g. Three new title variations that are focusing on the FOMO principle" as="textarea" rows="3"/>
          <Form.Text className="text-muted">
            Briefly describe the changes that you're making.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Example select</Form.Label>
          <Form.Control
            as="select"
            disabled={queryRes.loading}
            onChange={(evt) => { setProjectID(evt.target.value); }}
            value={projectID}
          >
            {/* While the project list is being loaded, we show this disabled option */}
            { queryRes.loading && <option>Loading...</option>}

            {/* If loading finished, show the project list */}
            { !queryRes.loading && <option value="">Select project</option>}
            { !queryRes.loading && map(projects, proj =>
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            )}
          </Form.Control>
        </Form.Group>
        <div className="d-flex justify-content-between w-100"> 
          <Button variant="primary" type="submit" disabled={!isValid || (updateRes && updateRes.loading)}>
            Continue
          </Button>
          <Button
            variant="outline-secondary"
            type="submit"
            disabled={updateRes && updateRes.loading}
            onClick={() => {
              if (!isEditing && onCancel) {
                onCancel();
              } else {
                reset();
              }
            }}
          >
            { !isEditing ? 'Cancel & delete' : 'Reset' }
          </Button>
        </div>
        { displayError &&
          <div className="text-danger mt-1">
            Error: {displayError}
          </div>
        }
      </Form>
    </div>
  );
};
