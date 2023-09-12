module.exports = {
  name: 'Exabeam',
  acronym: 'EXB',
  request: {
    // Provide the path to your certFile. Leave an empty string to ignore this option.
    cert: '',
    // Provide the path to your private key. Leave an empty string to ignore this option.
    key: '',
    // Provide the key passphrase if required.  Leave an empty string to ignore this option.
    passphrase: '',
    // Provide the Certificate Authority. Leave an empty string to ignore this option.
    ca: '',
    // An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for
    // the url parameter (by embedding the auth info in the uri)
    proxy: ''
  },
  logging: { level: 'info' },
  entityTypes: ['*'],
  polarityIntegrationUuid: "b5af7dc0-5198-11ee-b0ae-23ec381207bd",
  onDemandOnly: true,
  defaultColor: 'light-blue',
  customTypes: [
    {
      key: 'filename',
      regex:
        /^.{1,256}\.(jpg|gif|doc|pdf|docx|db|dbsys|sys|exe|dll|file|virus|dontopen|zip|php|hta|bat|pem|txt|dat|msg|lnk|dotm|log|py|xls|ps1|vbe|VBE|css|CSS|site|store|world|email|group|tools|vip|services|rocks|download|online|network|vin|club|wiki|vbs|ini|top|gdn|bid|tech|html|cloud|win|energy|support|date|app|xyz|desi|software|kim)$/
    },
    {
      key: 'hostname',
      regex: /^\w{1,40}$/
    }
  ],
  styles: ['./styles/styles.less'],
  block: {
    component: {
      file: './components/component.js'
    },
    template: {
      file: './templates/template.hbs'
    }
  },
  options: [
    {
      key: 'url',
      name: 'Exabeam URL',
      description: 'Exabeam URL',
      default: 'https://api.us-west.exabeam.cloud',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientId',
      name: 'Exabeam Client ID',
      description: 'Exabeam Client ID',
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'clientSecret',
      name: 'Exabeam Client Secret',
      description: 'Exabeam Client Secret',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'startTime',
      name: 'Exabeam start time for log search.',
      description: 'Timestamp to start the search',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'endTime',
      name: 'Exabeam end time for log search.',
      description: 'Timestamp to end the search.',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'searchFields',
      name: 'Exabeam searchable fields.',
      description: 'Select which fields you would like return values for.',
      default: [
        {
          value: 'activity', //TODO: ask about this.
          display: 'Activity'
        }
      ],
      type: 'select',
      options: [
        {
          value: 'activity',
          display: 'Activity'
        },
        {
          value: 'activity_type',
          display: 'Activity Type'
        },
        {
          value: 'alert_subject',
          display: 'Alert Subject'
        },
        {
          value: 'app',
          display: 'App'
        },
        {
          value: 'approxLogTime',
          display: 'Approximate Log Time'
        },
        {
          value: 'builder_name',
          display: 'Builder Name'
        },
        {
          value: 'collector_timestamp',
          display: 'Collector Timestamp'
        },
        {
          value: 'dest_user',
          display: 'Dest User'
        },
        {
          value: 'id',
          display: 'Id'
        },
        {
          value: 'injest_time',
          display: 'Injest Time'
        },
        {
          value: 'is_ioc',
          display: 'Is IOC'
        },
        {
          value: 'landscape',
          display: 'Landscape'
        },
        {
          value: 'method',
          display: 'Method'
        },
        {
          value: 'msg_type',
          display: 'Message Type'
        },
        {
          value: 'operation',
          display: 'Operation'
        },
        {
          value: 'operation_type',
          display: 'Opteration Type'
        },
        {
          value: 'outcome',
          display: 'Outcome'
        },
        {
          value: 'parsed',
          display: 'Parsed'
        },
        {
          value: 'parser_version',
          display: 'Parser Version'
        },
        {
          value: 'platform',
          display: 'Platform'
        },
        {
          value: 'product',
          display: 'Product'
        },
        {
          value: 'rawLogIds',
          display: 'Raw Log Ids'
        },
        {
          value: 'raw_log_size',
          display: 'Raw Log Size'
        },
        {
          value: 'raw_log_time_format',
          display: 'Raw Log Time Format'
        },
        {
          value: 'result',
          display: 'Result'
        },
        {
          value: 'subject',
          display: 'Subject'
        },
        {
          value: 'tier',
          display: 'Tier'
        },
        {
          value: 'time',
          display: 'Time'
        },
        {
          value: 'url',
          display: 'URL'
        },
        {
          value: 'vendor',
          display: 'Vendor'
        }
      ],
      multiple: true,
      userCanEdit: false,
      adminOnly: false
    }
  ]
};
