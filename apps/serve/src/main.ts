type ExperimentMap = Record<string, string>;

type EventCB = (err: ProgressEvent | null, req: XMLHttpRequest) => void;

interface Options {
  experiments: ExperimentMap;
  apiURL: string;
}

const init = ({ experiments, apiURL }: Options) => {
  /**
   * Wrapper around the event callback for logging, etc.
   */
  const defaultCB = (
    err: ProgressEvent | null,
    req: XMLHttpRequest,
    cb?: EventCB,
  ) => {
    if (err) {
      console.warn('ABZen', err);
    }
    if (cb) {
      cb(err, req);
    }
  };

  /**
   * Makes API call using XMLHttpRequest
   */
  const TIMEOUT = 10 * 1000;
  const send = (payload: Record<string, any>, cb?: EventCB) => {
    const req = new XMLHttpRequest();
    req.timeout = TIMEOUT;
    req.ontimeout = err => defaultCB(err, req, cb);
    req.onerror = err => defaultCB(err, req, cb);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        defaultCB(null, req, cb);
      }
    };

    req.open('POST', apiURL, true);
    req.send(JSON.stringify(payload));
  };

  /**
   * Returns the activated variation ID for the given experiment.
   *
   * @param experimentID - ID of the experiment to get variation for.
   */
  const getVariationID = (experimentID: string) => {
    return experiments[experimentID];
  };

  /**
   * Tracks a goal event for the given experiment.
   *
   * @param experimentID - ID of the experiment.
   * @param goalID - ID of the goal to track.
   * @param variationID - (Optional) ID of the variation that converted.
   *                      If not provided, uses the assigned variation.
   * @param cb - (Optional) Callback for checking if call succeeded or failed.
   */
  const trackGoal = (experimentID: string, goalID: string, variationID?: string, cb?: EventCB) => {
    send({
      type: 'goal',
      experimentID,
      goalID,
      variationID: variationID || getVariationID(experimentID),
    }, cb);
  };

  /**
   * Makes the variation selection sticky for the given ID in addition
   * to the current session so that if the user logs in from a new session the
   * same variations will be provided.
   *
   * @param id - An identifier for the user.
   * @param cb - (Optional) Callback for checking if call succeeded or failed.
   */
  const identify = (id: string, cb?: EventCB) => {
    send({
      type: 'identify',
      id,
    }, cb);
  };

  /**
   * Return lib functions.
   */
  window['abzen'] = {
    getVariationID,
    trackGoal,
    identify,
  };
};