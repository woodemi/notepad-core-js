Page({
  data: {
    scanResult: null
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("scanResult", function(data) {
      this.data.scanResult = data.scanResult;
    });
  },
})