polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  showCopyMessage: false,
  expandableTitleStates: {},
  uniqueIdPrefix: '',
  logs: Ember.computed.alias('block.data.details.rows'),
  init() {
    let array = new Uint32Array(5);
    this.set('uniqueIdPrefix', window.crypto.getRandomValues(array).join(''));
    this._super(...arguments);
  },
  actions: {
    copyData: function () {
      Ember.run.scheduleOnce(
        'afterRender',
        this,
        this.copyElementToClipboard,
        `raw-log-content-${this.get('uniqueIdPrefix')}`
      );

      Ember.run.scheduleOnce('destroy', this, this.restoreCopyState);
    },
    toggleExpandableTitle: function (index) {
      this.set(
        `expandableTitleStates`,
        Object.assign({}, this.get('expandableTitleStates'), {
          [index]: !this.get(`expandableTitleStates`)[index]
        })
      );
    }
  },
  copyElementToClipboard(element) {
    console.log(element);
    window.getSelection().removeAllRanges();
    let range = document.createRange();
    console.log(range);

    const el = document.getElementById(element);
    console.log(el);

    range.selectNode(
      typeof element === 'string' ? document.getElementById(element) : element
    );

    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  },
  restoreCopyState() {
    this.set('showCopyMessage', true);

    setTimeout(() => {
      if (!this.isDestroyed) {
        this.set('showCopyMessage', false);
      }
    }, 2000);
  }
});
