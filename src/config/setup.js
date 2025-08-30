import { loadEnvConfig } from "../utils/load-env-config.js";

const environment = __ENV.ENVIRONMENT || 'env';
loadEnvConfig(environment);