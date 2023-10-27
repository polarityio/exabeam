polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  expandableTitleStates: Ember.computed.alias('block._state.expandableTitleStates'),
  showCopyMessage: Ember.computed.alias('block._state.showCopyMessage'),

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
      this.set('block._state.expandableTitleStates', {});
      this.set('block._state.showCopyMessage', {});
    }
    this._super(...arguments);
  },
  actions: {
    copyTextToClipboard: function (text, index) {
      const json = text[0];

      navigator.clipboard
        .writeText(json)
        .then(() => {
          this.set(`block._state.showCopyMessage.${index}`, true);
        })
        .catch((err) => {})
        .finally(() => {
          setTimeout(() => {
            if (!this.isDestroyed) {
              this.set(`block._state.showCopyMessage.${index}`, false);
            }
          }, 2000);
        });
    },
    toggleExpandableTitle: function (index) {
      this.set(
        `block._state.expandableTitleStates`,
        Object.assign({}, this.get('block._state.expandableTitleStates'), {
          [index]: !this.get(`block._state.expandableTitleStates`)[index]
        })
      );
    }
  }
});
