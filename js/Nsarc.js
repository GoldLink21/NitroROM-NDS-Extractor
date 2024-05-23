// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.Nsarc = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
var Nsarc = (function() {
  function Nsarc(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Nsarc.prototype._read = function() {
    this.magic = this._io.readBytes(4);
    if (!((KaitaiStream.byteArrayCompare(this.magic, [78, 65, 82, 67]) == 0))) {
      throw new KaitaiStream.ValidationNotEqualError([78, 65, 82, 67], this.magic, this._io, "/seq/0");
    }
    this.byteOrder = this._io.readBytes(2);
    if (!((KaitaiStream.byteArrayCompare(this.byteOrder, [254, 255]) == 0))) {
      throw new KaitaiStream.ValidationNotEqualError([254, 255], this.byteOrder, this._io, "/seq/1");
    }
    this.version = this._io.readU2le();
    this.fileLen = this._io.readU4le();
    this.headerLen = this._io.readU2le();
    this.chunkCount = this._io.readU2le();
    this.btaf = this._io.readBytes(4);
    if (!((KaitaiStream.byteArrayCompare(this.btaf, [66, 84, 65, 70]) == 0))) {
      throw new KaitaiStream.ValidationNotEqualError([66, 84, 65, 70], this.btaf, this._io, "/seq/6");
    }
    this.fatLen = this._io.readU4le();
    this.numEntries = this._io.readU4le();
    this.fat = new NsarcFat(this._io, this, this._root, this.numEntries);
    this.btnf = this._io.readBytes(4);
    if (!((KaitaiStream.byteArrayCompare(this.btnf, [66, 84, 78, 70]) == 0))) {
      throw new KaitaiStream.ValidationNotEqualError([66, 84, 78, 70], this.btnf, this._io, "/seq/10");
    }
    this.btnfLen = this._io.readU4le();
    this._raw_fnt = this._io.readBytes((this.btnfLen - 8));
    var _io__raw_fnt = new KaitaiStream(this._raw_fnt);
    this.fnt = new FntBase(_io__raw_fnt, this, this._root, this.numEntries);
    this.gmif = this._io.readBytes(4);
    if (!((KaitaiStream.byteArrayCompare(this.gmif, [71, 77, 73, 70]) == 0))) {
      throw new KaitaiStream.ValidationNotEqualError([71, 77, 73, 70], this.gmif, this._io, "/seq/13");
    }
    this.gmifLen = this._io.readU4le();
    this.img = this._io.readBytes((this.gmifLen - 8));
  }

  var FntSubtable = Nsarc.FntSubtable = (function() {
    function FntSubtable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    FntSubtable.prototype._read = function() {
      this.entries = [];
      for (var i = 0; i < this._parent.numEntries; i++) {
        this.entries.push(new FntSubEntry(this._io, this, this._root));
      }
    }

    return FntSubtable;
  })();

  var FntSubEntry = Nsarc.FntSubEntry = (function() {
    function FntSubEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    FntSubEntry.prototype._read = function() {
      this.typeOrLen = this._io.readU1();
      this.fileName = KaitaiStream.bytesToStr(this._io.readBytes(this.typeOrLen), "ASCII");
    }

    /**
     * 01h..7Fh File Entry          (Length=1..127, without ID field)
     * 81h..FFh Sub-Directory Entry (Length=1..127, plus ID field)
     * 00h      End of Sub-Table
     * 80h      Reserved
     */

    /**
     * File or Sub-Directory Name, case-sensitive, without any ending
     * zero, ASCII 20h..7Eh, except for characters \/?"<>*:;|
     */

    return FntSubEntry;
  })();

  var FatEntry = Nsarc.FatEntry = (function() {
    function FatEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    FatEntry.prototype._read = function() {
      this.fileStart = this._io.readU4le();
      this.fileEnd = this._io.readU4le();
    }

    return FatEntry;
  })();

  var FntBase = Nsarc.FntBase = (function() {
    function FntBase(_io, _parent, _root, numEntries) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.numEntries = numEntries;

      this._read();
    }
    FntBase.prototype._read = function() {
      this.offsetOfSubtable = this._io.readU4le();
      this.firstFilePos = this._io.readU2le();
      this.numSubtables = this._io.readU2le();
    }
    Object.defineProperty(FntBase.prototype, 'subtables', {
      get: function() {
        if (this._m_subtables !== undefined)
          return this._m_subtables;
        var _pos = this._io.pos;
        this._io.seek(this.offsetOfSubtable);
        this._m_subtables = [];
        for (var i = 0; i < this.numSubtables; i++) {
          this._m_subtables.push(new FntSubtable(this._io, this, this._root));
        }
        this._io.seek(_pos);
        return this._m_subtables;
      }
    });

    return FntBase;
  })();

  var NsarcFat = Nsarc.NsarcFat = (function() {
    function NsarcFat(_io, _parent, _root, numEntries) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.numEntries = numEntries;

      this._read();
    }
    NsarcFat.prototype._read = function() {
      this.entries = [];
      for (var i = 0; i < this.numEntries; i++) {
        this.entries.push(new FatEntry(this._io, this, this._root));
      }
    }

    return NsarcFat;
  })();

  /**
   * Chunk Name "NARC" (Nitro Archive)
   */

  /**
   * Byte Order (FFFEh) (unlike usually, not FEFFh)
   */

  /**
   * Version (0100h)
   */

  /**
   * File Size (from "NARC" ID to end of file)
   */

  /**
   * Chunk Size (0010h)
   */

  /**
   * Number of following chunks (0003h)
   */

  /**
   * Chunk Name "BTAF" (File Allocation Table Block)
   */

  /**
   * Chunk Size (including above chunk name)
   */

  /**
   * Number of Files
   */

  /**
   * Chunk Name "BTNF" (File Name Table Block)
   */

  /**
   * Chunk Size (including above chunk name)
   */

  return Nsarc;
})();
return Nsarc;
}));
