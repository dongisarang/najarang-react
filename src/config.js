

const Config = (() => {
    let config = {
        serviceURL: '',
    };

    return {
        setConfig(opts) {
            config = { ...config, ...opts };
        },
        get serviceURL() {
            return config.serviceURL;
        },
    };
})();

export default Config;
