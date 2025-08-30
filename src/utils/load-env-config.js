
export function loadEnvConfig(env) {
    const configPath = `./${env}.json`;
    const config = JSON.parse(open(configPath, 'utf8'));
    for (const [key, value] of Object.entries(config)) {
        if (typeof value === 'object') {
            __ENV[key] = JSON.stringify(value);
        } else {
            __ENV[key] = value; 
        }
    }
}