module.exports = {
  name: 'Exabeam',
  description:
    'The Polarity Exabeam Integration can be used to detect and respond to security threats by analyzing user and entity behavior, collecting and correlating data from multiple sources.',
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
      key: 'lookBackDays',
      name: 'Exabeam Look Back Days',
      description: 'The number of days back for log search results in Exabeam.',
      default: 30,
      type: 'number',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'getRawLogs',
      name: 'Exabeam Raw Logs',
      description:
        'If selected, the response will contain the Raw logs returned from the Exabeam API.',
      default: false,
      type: 'boolean',
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
          value: 'builder_name',
          display: 'Builder Name'
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
