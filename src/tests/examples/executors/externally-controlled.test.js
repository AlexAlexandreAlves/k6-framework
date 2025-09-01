import http from 'k6/http';


/**
   // 
   @param {boolean} discardResponseBodies - Whether to discard response bodies.
   @param {Object} scenarios - The scenarios to run.
   @param {String} executor - The executor to use for the test.
   @param {String} exec - The function to execute for each virtual user.
   @param {String} duration - The duration of the test.

   When use externally-controlled? 
   When you want to have full control over the pacing and behavior of your virtual users, allowing for dynamic adjustments during the test.
   */
export const options = {
       discardResponseBodies: true,
       scenarios: {
           light_load: {
               executor: 'externally-controlled',
               exec: 'request',
               vus: 5,
               duration: '10s',
           }
       }
   }

export default function () {
    http.get('https://test.k6.io');
}
