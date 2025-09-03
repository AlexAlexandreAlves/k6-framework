import {
  errorCounter,
  successCounter,
  throughput,
  latency,
  ttfb,
  connectTime,
  sendTime,
  receiveTime,
  responseBodySize,
  requestBodySize,
} from './metrics.js';

export function recordMetrics(request, response) {
  if (response.status !== 200) {
    errorCounter.add(true, {
      name: request.tag,
      error_code: response.status,
      response_body: response.body,
    });
  } else {
    successCounter.add(true, { name: request.tag });
  }

  throughput.add(response.timings.duration);
  latency.add(response.timings.waiting);
  ttfb.add(response.timings.receiving);
  connectTime.add(response.timings.connecting);
  sendTime.add(response.timings.sending);
  receiveTime.add(response.timings.receiving);

  responseBodySize.add(response.body ? response.body.length : 0);
  requestBodySize.add(request.jsonBody ? request.jsonBody.length : 0);
}
