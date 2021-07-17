

const Config = (() => {
    let config = {
        serviceURL: '',
    };

    return {
        setConfig(opts) {
            console.log('config: ', config, 'opts:', opts)
            config = { ...config, ...opts };
            console.log('config: ', config)
        },
        get serviceURL() {
            return config.serviceURL;
        },
    };
})();

export default Config;
