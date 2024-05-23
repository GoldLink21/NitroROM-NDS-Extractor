// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.NdsNitroRom = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
/**
 * This is the format for Nintendo DS internal ROM storage
 */

var NdsNitroRom = (function() {
  function NdsNitroRom(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  NdsNitroRom.prototype._read = function() {
    this.header = new NdsNitroRomHeader(this._io, this, this._root);
  }

  var AllFiles = NdsNitroRom.AllFiles = (function() {
    function AllFiles(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    AllFiles.prototype._read = function() {
    }
    Object.defineProperty(AllFiles.prototype, 'files', {
      get: function() {
        if (this._m_files !== undefined)
          return this._m_files;
        this._m_files = [];
        for (var i = 0; i < this._root.fat.entries.length; i++) {
          this._m_files.push(new FileEntry(this._io, this, this._root, i));
        }
        return this._m_files;
      }
    });

    return AllFiles;
  })();

  var FntBaseTable = NdsNitroRom.FntBaseTable = (function() {
    function FntBaseTable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    FntBaseTable.prototype._read = function() {
      this.offsetOfSubtable = this._io.readU4le();
      this.firstSubtableId = this._io.readU2le();
      this.numSubtables = this._io.readU2le();
    }
    Object.defineProperty(FntBaseTable.prototype, 'subtables', {
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

    /**
     * Starts from base of this table
     */

    /**
     * First file starts at this index. This depends on how many overlay files there are
     */

    /**
     * Only appears in this base table
     */

    return FntBaseTable;
  })();

  var IconBmp = NdsNitroRom.IconBmp = (function() {
    function IconBmp(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    IconBmp.prototype._read = function() {
      this.tilesX = [];
      for (var i = 0; i < 8; i++) {
        this.tilesX.push(new IconTileStrip(this._io, this, this._root));
      }
      this.palette = [];
      for (var i = 0; i < 16; i++) {
        this.palette.push(this._io.readU2le());
      }
    }

    /**
     * Icon Palette (16 colors, 16bit, range 0000h-7FFFh). (Color 0 is transparent, so the 1st palette entry is ignored)
     */

    return IconBmp;
  })();

  var OverlayEntry = NdsNitroRom.OverlayEntry = (function() {
    function OverlayEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    OverlayEntry.prototype._read = function() {
      this.overlayId = this._io.readU4le();
      this.ramAddress = this._io.readU4le();
      this.lenFile = this._io.readU4le();
      this.bssLen = this._io.readU4le();
      this.staticInitStartAddress = this._io.readU4le();
      this.staticInitEndAddress = this._io.readU4le();
      this.fileId = this._io.readU4le();
      this.reserved = this._io.readBytes(4);
    }
    Object.defineProperty(OverlayEntry.prototype, 'file', {
      get: function() {
        if (this._m_file !== undefined)
          return this._m_file;
        var io = this._root._io;
        var _pos = io.pos;
        io.seek(this.ramAddress);
        this._m_file = io.readBytes(this.lenFile);
        io.seek(_pos);
        return this._m_file;
      }
    });

    /**
     * The ID of the overlay table
     */

    /**
     * RAM Address ;Point at which to load
     */

    /**
     * RAM Size    ;Amount to load
     */

    /**
     * BSS Size    ;Size of BSS data region
     */

    /**
     * Static initialiser start address
     */

    /**
     * Static initialiser end address
     */

    /**
     * File ID  (0000h..EFFFh)
     */

    /**
     * Usually zero filled
     */

    return OverlayEntry;
  })();

  var IconTile = NdsNitroRom.IconTile = (function() {
    function IconTile(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    IconTile.prototype._read = function() {
      this.pixelsX = [];
      for (var i = 0; i < 4; i++) {
        this.pixelsX.push(new IconPixelStrip(this._io, this, this._root));
      }
    }

    return IconTile;
  })();

  var NdsNitroRomHeader = NdsNitroRom.NdsNitroRomHeader = (function() {
    function NdsNitroRomHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    NdsNitroRomHeader.prototype._read = function() {
      this.gameTitle = KaitaiStream.bytesToStr(this._io.readBytes(12), "ASCII");
      this.gameCode = KaitaiStream.bytesToStr(this._io.readBytes(4), "ASCII");
      this.makerCode = KaitaiStream.bytesToStr(this._io.readBytes(2), "ASCII");
      this.unitCode = this._io.readBytes(1);
      this.encryptionSeed = this._io.readBytes(1);
      this.deviceCapacity = this._io.readBytes(1);
      this.reserved1 = this._io.readBytes(8);
      this.ndsRegion = this._io.readBytes(1);
      this.romVerion = this._io.readBytes(1);
      this.autostart = this._io.readBytes(1);
      this.arm9RomOffset = this._io.readU4le();
      this.arm9EntryAddress = this._io.readU4le();
      this.arm9RamAddress = this._io.readU4le();
      this.lenArm9 = this._io.readU4le();
      this.arm7RomOffset = this._io.readU4le();
      this.arm7EntryAddress = this._io.readU4le();
      this.arm7RamAddress = this._io.readU4le();
      this.lenArm7 = this._io.readU4le();
      this.fntOffset = this._io.readU4le();
      this.lenFnt = this._io.readU4le();
      this.fatOffset = this._io.readU4le();
      this.lenFat = this._io.readU4le();
      this.arm9OverlayOffset = this._io.readU4le();
      this.lenArm9Overlay = this._io.readU4le();
      this.arm7OverlayOffset = this._io.readU4le();
      this.lenArm7Overlay = this._io.readU4le();
      this.portNormalCommand = this._io.readU4le();
      this.portKey1Command = this._io.readU4le();
      this.iconOffset = this._io.readU4le();
      this.secureAreaChecksum = this._io.readU2le();
      this.secureAreaDelay = this._io.readU2le();
      this.arm9AutoloadList = this._io.readU4le();
      this.arm7AutoloadList = this._io.readU4le();
      this.secureAreaDisable = this._io.readBytes(8);
      this.lenRom = this._io.readU4le();
      this.lenRomHeader = this._io.readU4le();
      this.unknown1 = this._io.readBytes(4);
      this.reserved2 = this._io.readBytes(8);
      this.nandRomEnd = this._io.readU2le();
      this.nandRwStart = this._io.readU2le();
      this.reserved3 = this._io.readBytes(24);
      if (!((KaitaiStream.byteArrayCompare(this.reserved3, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) == 0))) {
        throw new KaitaiStream.ValidationNotEqualError([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], this.reserved3, this._io, "/types/nds_nitro_rom_header/seq/40");
      }
      this.reserved4 = this._io.readBytes(16);
      this.nintendoLogo = this._io.readBytes(156);
      this.nintendoLogoChecksum = this._io.readBytes(2);
      if (!((KaitaiStream.byteArrayCompare(this.nintendoLogoChecksum, [86, 207]) == 0))) {
        throw new KaitaiStream.ValidationNotEqualError([86, 207], this.nintendoLogoChecksum, this._io, "/types/nds_nitro_rom_header/seq/43");
      }
      this.headerChecksum = this._io.readBytes(2);
      this.debugRomOffset = this._io.readBytes(4);
      this.debugSize = this._io.readBytes(4);
      this.debugRamAddress = this._io.readBytes(4);
      this.reserved5 = this._io.readBytes(4);
      this.reserved6 = this._io.readBytes(144);
      this.reserved7 = this._io.readBytes(3584);
    }

    /**
     * Game Title (Uppercase ASCII, padded with 00h)
     */

    /**
     * Gamecode (Uppercase ASCII, NTR-<code>) (0=homebrew)
     */

    /**
     * Makercode (Uppercase ASCII, eg. "01"=Nintendo) (0=homebrew)
     */

    /**
     * Unitcode (00h=NDS, 02h=NDS+DSi, 03h=DSi) (bit1=DSi)
     */

    /**
     * Encryption Seed Select (00..07h, usually 00h)
     */

    /**
     * Devicecapacity (Chipsize = 128KB SHL nn) (eg. 7 = 16MB)
     */

    /**
     * NDS Region  (00h=Normal, 80h=China, 40h=Korea) (other on DSi)
     */

    /**
     * ROM Version (usually 00h)
     */

    /**
     * Autostart (Bit2 -> Skip "Press Button" after Health and Safety). (Also skips bootmenu, even in Manual mode & even Start pressed)
     */

    /**
     * ARM9 rom_offset (4000h and up, align 1000h)
     */

    /**
     * ARM9 entry_address (2000000h..23BFE00h)
     */

    /**
     * ARM9 ram_address (2000000h..23BFE00h)
     */

    /**
     * ARM9 size (max 3BFE00h) (3839.5KB)
     */

    /**
     * ARM7 rom_offset (8000h and up)
     */

    /**
     * ARM7 entry_address (2000000h..23BFE00h, or 37F8000h..3807E00h)
     */

    /**
     * ARM7 ram_address (2000000h..23BFE00h, or 37F8000h..3807E00h)
     */

    /**
     * ARM7 size (max 3BFE00h, or FE00h) (3839.5KB, 63.5KB)
     */

    /**
     * File Name Table (FNT) offset
     */

    /**
     * File Name Table (FNT) size
     */

    /**
     * File Allocation Table (FAT) offset
     */

    /**
     * File Allocation Table (FAT) size
     */

    /**
     * File ARM9 overlay_offset
     */

    /**
     * File ARM9 overlay_size
     */

    /**
     * File ARM7 overlay_offset
     */

    /**
     * File ARM7 overlay_size
     */

    /**
     * Port 40001A4h setting for normal commands (usually 00586000h)
     */

    /**
     * Port 40001A4h setting for KEY1 commands (usually 001808F8h)
     */

    /**
     * Icon/Title offset (0=None) (8000h and up)
     */

    /**
     * Secure Area Checksum, CRC-16 of [[020h]..00007FFFh]
     */

    /**
     * Secure Area Delay (in 131kHz units) (051Eh=10ms or 0D7Eh=26ms)
     */

    /**
     * ARM9 Auto Load List Hook RAM Address (?) ;\endaddr of auto-load
     */

    /**
     * ARM7 Auto Load List Hook RAM Address (?) ;/functions
     */

    /**
     * Secure Area Disable (by encrypted "NmMdOnly") (usually zero)
     */

    /**
     * Total Used ROM size (remaining/unused bytes usually FFh-padded)
     */

    /**
     * ROM Header Size (4000h)
     */

    /**
     * Unknown, some rom_offset, or zero? (DSi -> slightly different)
     */

    /**
     * Reserved (zero filled; except, [88h..93h] used on DSi)
     */

    /**
     * NAND end of ROM area  ;\in 20000h-byte units (DSi -> 80000h-byte)
     */

    /**
     * NAND start of RW area ;/usually both same address (0=None)
     */

    /**
     * Reserved (zero filled)
     */

    /**
     * Reserved (zero filled; or "DoNotZeroFillMem"=unlaunch fastboot)
     */

    /**
     * Nintendo Logo (compressed bitmap, same as in GBA Headers)
     */

    /**
     * Nintendo Logo Checksum, CRC-16 of [0C0h-15Bh], fixed CF56h
     */

    /**
     * Header Checksum, CRC-16 of [000h-15Dh]
     */

    /**
     * Debug rom_offset (0=none) (8000h and up) ;only if debug
     */

    /**
     * Debug size (0=none) (max 3BFE00h) ;version with
     */

    /**
     * Debug ram_address (0=none) (2400000h..27BFE00h) ;SIO and 8MB
     */

    /**
     * Reserved (zero filled) (transferred, and stored, but not used)
     */

    /**
     * Reserved (zero filled) (transferred, but not stored in RAM)
     */

    /**
     * Reserved (zero filled) (usually not transferred)
     */

    return NdsNitroRomHeader;
  })();

  var FntSubtable = NdsNitroRom.FntSubtable = (function() {
    function FntSubtable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    FntSubtable.prototype._read = function() {
      this.entries = [];
      var i = 0;
      do {
        var _ = new FntSubEntry(this._io, this, this._root);
        this.entries.push(_);
        i++;
      } while (!(_.typeOrLen == 0));
    }

    return FntSubtable;
  })();

  var FntSubEntry = NdsNitroRom.FntSubEntry = (function() {
    function FntSubEntry(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    FntSubEntry.prototype._read = function() {
      this.typeOrLen = this._io.readU1();
      this.fileName = KaitaiStream.bytesToStr(this._io.readBytes((this.typeOrLen & 127)), "ASCII");
      if ((this.typeOrLen & 128) != 0) {
        this.subDirId = this._io.readU2le();
      }
    }

    /**
     * The element in the base table that is the sub directory
     */
    Object.defineProperty(FntSubEntry.prototype, 'subDir', {
      get: function() {
        if (this._m_subDir !== undefined)
          return this._m_subDir;
        if ((this.typeOrLen & 128) != 0) {
          this._m_subDir = this._parent._parent.subtables[(this.subDirId & 4095)];
        }
        return this._m_subDir;
      }
    });

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

    /**
     * Sub-Directory ID (F001h..FFFFh) ;see FNT+(ID AND FFFh)*8
     */

    return FntSubEntry;
  })();

  var FatEntry = NdsNitroRom.FatEntry = (function() {
    function FatEntry(_io, _parent, _root, i) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.i = i;

      this._read();
    }
    FatEntry.prototype._read = function() {
      this.fileStart = this._io.readU4le();
      this.fileEnd = this._io.readU4le();
    }
    Object.defineProperty(FatEntry.prototype, 'file', {
      get: function() {
        if (this._m_file !== undefined)
          return this._m_file;
        var io = this._root._io;
        var _pos = io.pos;
        io.seek(this.fileStart);
        this._m_file = io.readBytes((this.fileEnd - this.fileStart));
        io.seek(_pos);
        return this._m_file;
      }
    });

    return FatEntry;
  })();

  /**
   * Holds all the entries for the overlay table
   */

  var OverlayTable = NdsNitroRom.OverlayTable = (function() {
    function OverlayTable(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    OverlayTable.prototype._read = function() {
      this.overlays = [];
      var i = 0;
      while (!this._io.isEof()) {
        this.overlays.push(new OverlayEntry(this._io, this, this._root));
        i++;
      }
    }

    return OverlayTable;
  })();

  var IconPixelStrip = NdsNitroRom.IconPixelStrip = (function() {
    function IconPixelStrip(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    IconPixelStrip.prototype._read = function() {
      this.pixelsY = [];
      for (var i = 0; i < 4; i++) {
        this.pixelsY.push(new IconPixel(this._io, this, this._root));
      }
    }

    return IconPixelStrip;
  })();

  var NitroFat = NdsNitroRom.NitroFat = (function() {
    function NitroFat(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    NitroFat.prototype._read = function() {
      this.entries = [];
      var i = 0;
      while (!this._io.isEof()) {
        this.entries.push(new FatEntry(this._io, this, this._root, i));
        i++;
      }
    }

    return NitroFat;
  })();

  var IconTileStrip = NdsNitroRom.IconTileStrip = (function() {
    function IconTileStrip(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    IconTileStrip.prototype._read = function() {
      this.tilesY = [];
      for (var i = 0; i < 4; i++) {
        this.tilesY.push(new IconTile(this._io, this, this._root));
      }
    }

    return IconTileStrip;
  })();

  var FileEntry = NdsNitroRom.FileEntry = (function() {
    function FileEntry(_io, _parent, _root, index) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;
      this.index = index;

      this._read();
    }
    FileEntry.prototype._read = function() {
    }
    Object.defineProperty(FileEntry.prototype, 'data', {
      get: function() {
        if (this._m_data !== undefined)
          return this._m_data;
        this._m_data = this._root.fat.entries[this.index].file;
        return this._m_data;
      }
    });
    Object.defineProperty(FileEntry.prototype, 'fileSize', {
      get: function() {
        if (this._m_fileSize !== undefined)
          return this._m_fileSize;
        this._m_fileSize = this._root.fat.entries[this.index].file.length;
        return this._m_fileSize;
      }
    });

    return FileEntry;
  })();

  var IconPixel = NdsNitroRom.IconPixel = (function() {
    function IconPixel(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    IconPixel.prototype._read = function() {
      this.ci1 = this._io.readBitsIntBe(4);
      this.ci2 = this._io.readBitsIntBe(4);
    }

    /**
     * The color grabbed from the palette
     */
    Object.defineProperty(IconPixel.prototype, 'c1', {
      get: function() {
        if (this._m_c1 !== undefined)
          return this._m_c1;
        this._m_c1 = this._root.iconTitle.icon.palette[this.ci1];
        return this._m_c1;
      }
    });
    Object.defineProperty(IconPixel.prototype, 'c2', {
      get: function() {
        if (this._m_c2 !== undefined)
          return this._m_c2;
        this._m_c2 = this._root.iconTitle.icon.palette[this.ci2];
        return this._m_c2;
      }
    });

    return IconPixel;
  })();

  var NdsIconTitle = NdsNitroRom.NdsIconTitle = (function() {
    function NdsIconTitle(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    NdsIconTitle.prototype._read = function() {
      this.version = this._io.readU2le();
      this.crc161 = this._io.readU2le();
      this.crc162 = this._io.readU2le();
      this.crc163 = this._io.readU2le();
      this.crc164 = this._io.readU2le();
      this.reserved1 = this._io.readBytes(22);
      this.icon = new IconBmp(this._io, this, this._root);
      this.titleJapanese = KaitaiStream.bytesToStr(this._io.readBytes(256), "UTF-16LE");
      this.titleEnglish = KaitaiStream.bytesToStr(this._io.readBytes(256), "UTF-16LE");
      this.titleFrench = KaitaiStream.bytesToStr(this._io.readBytes(256), "UTF-16LE");
      this.titleGerman = KaitaiStream.bytesToStr(this._io.readBytes(256), "UTF-16LE");
      this.titleItalian = KaitaiStream.bytesToStr(this._io.readBytes(256), "UTF-16LE");
      this.titleSpanish = KaitaiStream.bytesToStr(this._io.readBytes(256), "UTF-16LE");
      this.padding = this._io.readBytes(448);
    }

    /**
     * Version (0001h, 0002h, 0003h, or 0103h)
     */

    /**
     * CRC16 across entries 0020h..083Fh (all versions)
     */

    /**
     * CRC16 across entries 0020h..093Fh (Version 0002h and up)
     */

    /**
     * CRC16 across entries 0020h..0A3Fh (Version 0003h and up)
     */

    /**
     * CRC16 across entries 1240h..23BFh (Version 0103h and up)
     */

    /**
     * Reserved (zero-filled)
     */

    /**
     * Icon Bitmap  (32x32 pix) (4x4 tiles, 4bit depth) (4x8 bytes/tile)
     */

    /**
     * Title 0 Japanese (128 characters, 16bit Unicode)
     */

    /**
     * Title 1 English (128 characters, 16bit Unicode)
     */

    /**
     * Title 2 French (128 characters, 16bit Unicode)
     */

    /**
     * Title 3 German (128 characters, 16bit Unicode)
     */

    /**
     * Title 4 Italian (128 characters, 16bit Unicode)
     */

    /**
     * Title 5 Spanish (128 characters, 16bit Unicode)
     */

    /**
     * Unused/padding (FFh-filled) in Version 0001hr
     */

    return NdsIconTitle;
  })();
  Object.defineProperty(NdsNitroRom.prototype, 'arm7Rom', {
    get: function() {
      if (this._m_arm7Rom !== undefined)
        return this._m_arm7Rom;
      var _pos = this._io.pos;
      this._io.seek(this.header.arm7RomOffset);
      this._m_arm7Rom = this._io.readBytes(this.header.lenArm7);
      this._io.seek(_pos);
      return this._m_arm7Rom;
    }
  });
  Object.defineProperty(NdsNitroRom.prototype, 'fnt', {
    get: function() {
      if (this._m_fnt !== undefined)
        return this._m_fnt;
      var _pos = this._io.pos;
      this._io.seek(this.header.fntOffset);
      this._raw__m_fnt = this._io.readBytes(this.header.lenFnt);
      var _io__raw__m_fnt = new KaitaiStream(this._raw__m_fnt);
      this._m_fnt = new FntBaseTable(_io__raw__m_fnt, this, this._root);
      this._io.seek(_pos);
      return this._m_fnt;
    }
  });
  Object.defineProperty(NdsNitroRom.prototype, 'secureArea', {
    get: function() {
      if (this._m_secureArea !== undefined)
        return this._m_secureArea;
      var _pos = this._io.pos;
      this._io.seek(16384);
      this._m_secureArea = this._io.readBytes(12288);
      this._io.seek(_pos);
      return this._m_secureArea;
    }
  });
  Object.defineProperty(NdsNitroRom.prototype, 'files', {
    get: function() {
      if (this._m_files !== undefined)
        return this._m_files;
      this._m_files = new AllFiles(this._io, this, this._root);
      return this._m_files;
    }
  });
  Object.defineProperty(NdsNitroRom.prototype, 'arm9Rom', {
    get: function() {
      if (this._m_arm9Rom !== undefined)
        return this._m_arm9Rom;
      var _pos = this._io.pos;
      this._io.seek(this.header.arm9RomOffset);
      this._m_arm9Rom = this._io.readBytes(this.header.lenArm9);
      this._io.seek(_pos);
      return this._m_arm9Rom;
    }
  });
  Object.defineProperty(NdsNitroRom.prototype, 'iconTitle', {
    get: function() {
      if (this._m_iconTitle !== undefined)
        return this._m_iconTitle;
      var _pos = this._io.pos;
      this._io.seek(this.header.iconOffset);
      this._m_iconTitle = new NdsIconTitle(this._io, this, this._root);
      this._io.seek(_pos);
      return this._m_iconTitle;
    }
  });
  Object.defineProperty(NdsNitroRom.prototype, 'arm7Overlays', {
    get: function() {
      if (this._m_arm7Overlays !== undefined)
        return this._m_arm7Overlays;
      var _pos = this._io.pos;
      this._io.seek(this.header.arm7OverlayOffset);
      this._raw__m_arm7Overlays = this._io.readBytes(this.header.lenArm7Overlay);
      var _io__raw__m_arm7Overlays = new KaitaiStream(this._raw__m_arm7Overlays);
      this._m_arm7Overlays = new OverlayTable(_io__raw__m_arm7Overlays, this, this._root);
      this._io.seek(_pos);
      return this._m_arm7Overlays;
    }
  });
  Object.defineProperty(NdsNitroRom.prototype, 'arm9Overlays', {
    get: function() {
      if (this._m_arm9Overlays !== undefined)
        return this._m_arm9Overlays;
      var _pos = this._io.pos;
      this._io.seek(this.header.arm9OverlayOffset);
      this._raw__m_arm9Overlays = this._io.readBytes(this.header.lenArm9Overlay);
      var _io__raw__m_arm9Overlays = new KaitaiStream(this._raw__m_arm9Overlays);
      this._m_arm9Overlays = new OverlayTable(_io__raw__m_arm9Overlays, this, this._root);
      this._io.seek(_pos);
      return this._m_arm9Overlays;
    }
  });
  Object.defineProperty(NdsNitroRom.prototype, 'fat', {
    get: function() {
      if (this._m_fat !== undefined)
        return this._m_fat;
      var _pos = this._io.pos;
      this._io.seek(this.header.fatOffset);
      this._raw__m_fat = this._io.readBytes(this.header.lenFat);
      var _io__raw__m_fat = new KaitaiStream(this._raw__m_fat);
      this._m_fat = new NitroFat(_io__raw__m_fat, this, this._root);
      this._io.seek(_pos);
      return this._m_fat;
    }
  });

  return NdsNitroRom;
})();
return NdsNitroRom;
}));
