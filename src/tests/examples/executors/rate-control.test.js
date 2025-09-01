import http from 'k6/http';


/**
   // 
   @param {boolean} discardResponseBodies - Whether to discard response bodies.
   @param {Object} scenarios - The scenarios to run.
   @param {String} executor - The executor to use for the test.
   @param {Number} rate - The rate of requests per time unit.
   @param {String} duration - The duration of the test.

   When use rate-control? 
   When you want to control the rate of requests being sent to the server, allowing for more precise load testing.
   */

   export const options = {
       discardResponseBodies: true,
       scenarios: {
           light_load: {
               executor: 'rate-control',
               rate: 5,
               duration: '10s',
           }
       }
   }

export default function () {
    http.get('https://test.k6.io');
}
