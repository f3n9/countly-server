/**
* Module for user provided API configurations
* @module api/config
*/

/** @lends module:api/config */
var countlyConfig = {
    /**
    * MongoDB connection definition and options
    * @type {object} 
    * @property {string} [host=localhost] - host where to connect to mongodb, default localhost
    * @property {array=} replSetServers - array with multiple hosts, if you are connecting to replica set, provide this instead of host
    * @property {string=} replicaName - replica name, must provide for replica set connection to work
    * @property {string} [db=countly] - countly database name, default countly
    * @property {number} [port=27017] - port to use for mongodb connection, default 27017
    * @property {number} [max_pool_size=500] - how large pool size connection per process to create, default 500 per process, not recommended to be more than 1000 per server
    * @property {string=} username - username for authenticating user, if mongodb supports authentication
    * @property {string=} password - password for authenticating user, if mongodb supports authentication
    * @property {object=} dbOptions - provide raw driver database options
    * @property {object=} serverOptions - provide raw driver server options, used for all, single, mongos and replica set servers
    */
    mongodb: {
	host: "10.128.52.48",
        db: "countly",
	username: "countly",
	password: "countly3105",
        max_pool_size: 1000,
        dbOptions:{
            //db options
            native_parser: true,
	    authsource: "admin"
        },
        serverOptions:{
            //server options
            ssl:false
        }
    },
    /*  or define as a url
	//mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
	mongodb: "mongodb://localhost:27017/countly",
    */
    /**
     * Redis configuration. 
     * @property {string} host - host of redis, ip or hostname
     * @property {number} port - port of redis
     * @property {string} instanceId - redis instance id in Tencent cloud
     * @property {string} pwd - password of redis
     */
    redis: {
        host: "10.112.68.14",
        port: 6379,
        instanceId: "",
        pwd: "stage!redis",
    },

    /**
     * Define events of apps which will be published to Redis
     * NOTE!!! you must provide 'redis' configuration before use this option.
     * @property {string} redis_pub_topic - the topic of publish events in Redis.
     * @property {array=} apps - the array of applications, include app_id and filter_keys.
     *      @property {string} app_id - App Id that defined in Countly, which can be found from 'Management -> Applications'
     *      @property {array=} filter_keys - Each application can have multiple filters, relationship is 'OR' among them,
     *                                      which means each item of 'filter_keys' can get a kind of records.
     *          @property {array=} object - key/value pair, the record must match all of the filters.
     *                                      {string} key - the property path of Countly Event.
     *                                      {array=} values - multiple values, matches one is ok (relation is 'OR').
     *                                                       NOTE: item of values support regex.
     * Tips: 
     *  1. If 'apps' is empty(set to []), means filter nothing, no records will be published.
     *  2. if 'filter_keys' is empty (set to []), means publish all events of the 'app_id'
     */
    yx_event_publish: {
        redis_pub_topic: "countly-event-pub",
        apps: [
            {
                app_id: "5c32fa238e46dd00526ee6c3", // MacOS 
                filter_keys: [
                    [ /** event of paywall */
                        {key: "event.segmentation.ec", values: ["^upgrade_(basic|plus|premium)$"]}, // AND
                        {key: "event.segmentation.ea", values: ["^(click|saw)_upsell$"]},
                        {key: "event.segmentation.el", values: ["^ctxt_bulkupload_dialog_(singleaction|singlenote)$", 
                                                                "^ctxt_docsearch_dialog_(attach|drag)$",
                                                                "^ctxt_mytemplate$", "^ctxt_nearquota_dialog_250mbleft$",
                                                                "^ctxt_notehistory_dialog_intro$",
                                                                "^ctxt_(notesize|overquota)_dialog_exceeded$",
                                                                "^ctxt_(pdf|presentationmode)_trial_(expired|expiring14|expiring7|start)$"
                                                                ]},
                    ], // OR
                ],
            },
            {
                app_id: "5c33236d4c70d50044982d20", // iOS
                filter_keys: [
                    [
                        {key: "event.segmentation.category", values: ["^upgrade_(basic|plus|premium)$"]}, // AND
                        {key: "event.segmentation.action", values: ["^(click|saw)_upsell$"]},
                        {key: "event.segmentation.label", values: ["^ctxt_businesscard_trial_(over|start)$",
                                                                "^ctxt_mytemplate$", "^ctxt_notesize_banner_(notecontent|notelist)$",
                                                                "^ctxt_notesize_dialog_(attachImage|background|noUpsellAdd|noUpsellSync|reprompt)$",
                                                                "^ctxt_offline_notebook_after_creation$",
                                                                "^ctxt_pdf_trial_(expiring|start)$",
                                                                "^ctxt_pdfAnnotation_pdfViewIcon$",
                                                                "^(entry_source: |)perm_offline_(notebok_list|toggle_notelist)$"]},
                    ],
                ],
            },
            {
                app_id: "5c3323ac8e46dd00526ee6c7", // Android
                filter_keys: [
                    [
                        {key: "event.key", values: ["^upgrade_(basic|plus|premium)$"]}, // AND
                        {key: "event.segmentation.action", values: ["^(click|saw)_upsell$"]},
                        {key: "event.segmentation.label", values: ["^ctxt_businesscard_overlay_unlock$", "^ctxt_docsearch_dialog_attach$",
                                                                "^ctxt_template$", "^ctxt_nearquota_card_(over75|premium)$",
                                                                "^ctxt_nearquota_dialog_attach_(plus|premium)$",
                                                                "^ctxt_notesize_banner_exceeded$", 
                                                                "^ctxt_offline_(card_isOffline|dialog_3rdNotebook|notification_reminder)$",
                                                                "^ctxt_overquota_(banner|card)_exceeded$",
                                                                "^perm_docsearch_emptystate_searchInput$",
                                                                "^perm_offline_(longpress|overflow|syncpref)_notebook$",
                                                                "^rglr_docsearch_card_searchInput$",
                                                                "^rglr_offline_(card_intro|notebook_view_toggle)$"]}
                    ],
                    [ // new Android
                        {key: "event.segmentation.category", values: ["^upgrade_(basic|plus|premium)$"]}, // AND
                        {key: "event.segmentation.action", values: ["^(click|saw)_upsell$"]},
                        {key: "event.segmentation.label", values: ["^ctxt_businesscard_overlay_unlock$", "^ctxt_docsearch_dialog_attach$",
                                                                "^ctxt_template$", "^ctxt_nearquota_card_(over75|premium)$",
                                                                "^ctxt_nearquota_dialog_attach_(plus|premium)$",
                                                                "^ctxt_notesize_banner_exceeded$", 
                                                                "^ctxt_offline_(card_isOffline|dialog_3rdNotebook|notification_reminder)$",
                                                                "^ctxt_overquota_(banner|card)_exceeded$",
                                                                "^perm_docsearch_emptystate_searchInput$",
                                                                "^perm_offline_(longpress|overflow|syncpref)_notebook$",
                                                                "^rglr_docsearch_card_searchInput$",
                                                                "^rglr_offline_(card_intro|notebook_view_toggle)$",
                                                                "^rglr_notebook_dialog_after_creation$", // different part
                                                                "^ctxt_pdf_trial_(expired|expiring_(11|14|2)|start)$"]}
                    ],
                ],
            },
            {
                app_id: "5c2dc53101343000399fad80", // Windows
                filter_keys: [
                    [
                        {key: "event.segmentation.ec", values: ["^upgrade_(basic|plus|premium|unknown)$"]}, // AND
                        {key: "event.segmentation.ea", values: ["^(click|saw)_upsell$"]},
                        {key: "event.segmentation.el", values: ["^ctxt_docsearch_dialog_drag$", "^ctxt_mytemplate$",
                                                                "^ctxt_nearquota_banner_over(50|50_15days|75|95)$",
                                                                "^ctxt_nearquota_dialog_premium$",
                                                                "^ctxt_notehistory_dialog_intro$",
                                                                "^ctxt_notesize_dialog_((after|before)EditResource|exceeded|largeDocument|resource(|s)|tooLargeToCopy)$",
                                                                "^ctxt_overquota_(banner|dialog)_(exceeded|premium)$",
                                                                "^ctxt_pdf_trial_(expired|expiring|start)$",
                                                                "^ctxt_presentationmode_tial_start$"]}
                    ],
                ],
            },
            /**{
                app_id: "5c932282f8b97a0039cc29ff", // Web 
                filter_keys: [
                    [
                        {key: "event.segmentation.eventAction", values: []},
                    ],
                ],
            }, */
        ],
    },

    /**
    * Default API configuration
    * @type {object} 
    * @property {number} [port=3001] - api port number to use, default 3001
    * @property {string} [host=localhost] - host to which to bind connection
    * @property {number} [max_sockets=1024] - maximal amount of sockets to open simultaneously
    * @property {number} workers - amount of paralel countly processes to run, defaults to cpu/core amount
    * @property {number} [timeout=120000] - nodejs server request timeout, need to also increase nginx timeout too for longer requests
    * @property {object=} push_proxy - push proxy settings
    */
    api: {
        port: 3001,
        host: "localhost",
	domain: "https://analytics.yinxiang.com",
        max_sockets: 1024,
        timeout: 120000
        /* GCM proxy server for push plugin
        push_proxy: {
            host: 'localhost',
            port: 8888
        } */
    },
    /**
    * Path to use for countly directory, empty path if installed at root of website
    * @type {string} 
    */
    path: "",
    /**
    * Default logging settings
    * @type {object} 
    * @property {string} [default=warn] - default level of logging for {@link logger}
    * @property {array=} info - modules to log for information level for {@link logger}
    */
    logging: {
        info: ["jobs", "push"],
        default: "warn"
    },
    /**
    * Default proxy settings, if provided then countly uses ip address from the right side of x-forwarded-for header ignoring list of provided proxy ip addresses
    * @type {array=} 
    */
    ignoreProxies: [/*"127.0.0.1"*/],

    /**
    * Default settings to be used for {@link module:api/utils/utils.encrypt} and {@link module:api/utils/utils.decrypt} functions and for commandline
    * @type {object}
    * @property {string} key - key used for encryption and decryption
    * @property {string|Buffer} iv - initialization vector to make encryption more secure
    * @property {string} algorithm - name of the algorithm to use for encryption. The algorithm is dependent on OpenSSL, examples are 'aes192', etc. On recent OpenSSL releases, openssl list-cipher-algorithms will display the available cipher algorithms. Default value is aes-256-cbc
    * @property {string} input_encoding - how encryption input is encoded. Used as output for decrypting. Default utf-8.
    * @property {string} output_encoding - how encryption output is encoded. Used as input for decrypting. Default hex.
    */
    encryption: {},

    /**
    * Specifies where to store files. Value "fs" means file system or basically storing files on hard drive. Another currently supported option is "gridfs" storing files in MongoDB database using GridFS. By default fallback to "fs";
    * @type {string} [default=fs]
    */
    fileStorage: "fs",
    /**
    *Specifies after how long time configurations are reloded from data base. Default value is 10000 (10 seconds)
    * @type {integer} [default=10000]
    **/
    reloadConfigAfter: 10000
};

// Set your host IP or domain to be used in the emails sent
countlyConfig.host = "analytics.yinxiang.com";
countlyConfig.domain = "https://analytics.yinxiang.com";

module.exports = require('./configextender')('API', countlyConfig, process.env);
