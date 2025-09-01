import http from 'k6/http';


/**
   @param {boolean} discardResponseBodies - Whether to discard response bodies.
   @param {Object} scenarios - The scenarios to run.
   @param {String} executor - The executor to use for the test.
   @param {String} duration - The duration of the test.

   When use constant-vus-rate? 
   When you want to simulate a specific number of virtual users over time, regardless of the request rates.
   This approach is more useful for scenarios where you want to maintain a steady load on the system, for example.
   */
export const options = {
       discardResponseBodies: true,
       scenarios: {
           light_load: {
               executor: 'constant-vus',
               exec: 'request',
               vus: 5,
               duration: '10s',
           }
       }
   }

export default function () {
    http.get('https://test.k6.io');
}
