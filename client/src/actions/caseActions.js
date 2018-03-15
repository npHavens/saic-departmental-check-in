import axios from 'axios';
import{ getCases } from './casesActions.js';

/*** Action Creators ***/


/*** Case Actions ***/

const createNew = (event) => (dispatch, getState) => {
  const { contact, newCase } = getState();

  axios.post('/cases', {
    id: contact.Id,
    subject: newCase.subject
  })
  .then(data => {
    getCases(contact.Id)(dispatch);
  })
  .catch(err => {
    console.log(err);
  })
};

export {createNew};