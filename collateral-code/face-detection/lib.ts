const classificationRegion = (
  rowCenter: number,
  columnCenter: number,
  size: number,
  pixels: number[],
  ldim: number // in order to access a given pixel use pixels[r*ldim + c]
): number => -1; // returns region score

const unpackCascade = (bytes: number) => {
  const dview = new DataView(new ArrayBuffer(4));

  var p = 8;

  dview.setUint8(0, bytes[p + 0]),
    dview.setUint8(1, bytes[p + 1]),
    dview.setUint8(2, bytes[p + 2]),
    dview.setUint8(3, bytes[p + 3]);
  var tdepth = dview.getInt32(0, true);
  var p = p + 4;

  dview.setUint8(0, bytes[p + 0]),
    dview.setUint8(1, bytes[p + 1]),
    dview.setUint8(2, bytes[p + 2]),
    dview.setUint8(3, bytes[p + 3]);
  var ntrees = dview.getInt32(0, true);
  p = p + 4;

  var tcodes = [];
  var tpreds = [];
  var thresh = [];

  for (var t; t < ntrees; t++) {}
};
