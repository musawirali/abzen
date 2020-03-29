import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export interface HeaderPropsType {
  gotoCreate: () => void;
}

export const Header: React.FC<HeaderPropsType> = (props) => {
  const { gotoCreate } = props;

  return (
    <Row className="mt-5">
      <Col className="d-flex justify-content-between">
        <h4>
          Experiments
        </h4>
        <Button
          variant="primary"
          onClick={() => {
            gotoCreate();
          }}
        >
          Create new experiment
        </Button>
      </Col>
    </Row>
  );
};
