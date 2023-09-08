polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias("block.data.details"),
  showCopyMessage: false,
  uniqueIdPrefix: "",
  logs: Ember.computed.alias("block.data.details.rows"),
  init() {
    let array = new Uint32Array(5);
    this.set("uniqueIdPrefix", window.crypto.getRandomValues(array).join(""));
    this._super(...arguments);
  },
  actions: {
    copyData: function () {
      console.log("copyData");

      Ember.run.scheduleOnce(
        "afterRender",
        this,
        this.copyElementToClipboard,
        `raw-log-content-${this.get("uniqueIdPrefix")}`
      );

      Ember.run.scheduleOnce("destroy", this, this.restoreCopyState);
    },
  },
  copyElementToClipboard(element) {
    window.getSelection().removeAllRanges();
    let range = document.createRange();

    range.selectNode(
      typeof element === "string" ? document.getElementById(element) : element
    );
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  },
  restoreCopyState() {
    this.set("showCopyMessage", true);

    setTimeout(() => {
      if (!this.isDestroyed) {
        this.set("showCopyMessage", false);
      }
    }, 2000);
  },
});
