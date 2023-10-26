polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  showCopyMessage: false,
  expandableTitleStates: {},
  uniqueIdPrefix: '',
  logs: Ember.computed('block.data.details.rows', function () {
    const logs = this.get('block.data.details.rows');
    const displayFields = this.get('block.userOptions.displayFields').map(
      (field) => field.value
    );

    for (const log of logs) {
      for (const key of Object.keys(log)) {
        if (!displayFields.includes(key) && key !== 'rawLogs') {
          delete log[key];
        }
      }
    }
    return logs;
  }),
  init() {
    if (!this.get('block._state')) {
      this.set('block._state', {});
    }
    this._super(...arguments);
  },
  actions: {
    copyTextToClipboard: function (text, target) {
      const json = text[0];

      navigator.clipboard
        .writeText(json)
        .then(() => {
          this.set('showCopyMessage', true);
          this.set(`block._state.${target}`, true);
        })
        .catch((err) => {})
        .finally(() => {
          setTimeout(() => {
            if (!this.isDestroyed) {
              this.set('showCopyMessage', false);
              this.set(`block._state.${target}`, false);
            }
          }, 2000);
        });
    },
    toggleExpandableTitle: function (index) {
      this.set(
        `expandableTitleStates`,
        Object.assign({}, this.get('expandableTitleStates'), {
          [index]: !this.get(`expandableTitleStates`)[index]
        })
      );
    }
  }
});
