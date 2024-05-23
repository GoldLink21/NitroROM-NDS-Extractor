meta:
  id: nds_icon_title
  title: Nintendo DS Icon/Title
  encoding: ASCII
  endian: le
seq:
  - id: version
    type: u2
    doc: Version (0001h, 0002h, 0003h, or 0103h)
  - id: crc16_1
    type: u2
    doc: CRC16 across entries 0020h..083Fh (all versions)
  - id: crc16_2
    type: u2
    doc: CRC16 across entries 0020h..093Fh (Version 0002h and up)
  - id: crc16_3
    type: u2
    doc: CRC16 across entries 0020h..0A3Fh (Version 0003h and up)
  - id: crc16_4
    type: u2
    doc: CRC16 across entries 1240h..23BFh (Version 0103h and up)
  - id: reserved_1
    size: 0x16
    doc: Reserved (zero-filled)
  - id: icon_bitmap
    # TODO: break up icon format
    size: 0x200
    doc: Icon Bitmap  (32x32 pix) (4x4 tiles, 4bit depth) (4x8 bytes/tile)
  - id: icon_palette
    type: u2
    repeat: expr
    repeat-expr: 16
    doc: Icon Palette (16 colors, 16bit, range 0000h-7FFFh). (Color 0 is transparent, so the 1st palette entry is ignored)
  - id: title_japanese
    size: 256
    type: str
    encoding: UTF-16LE
    doc: Title 0 Japanese (128 characters, 16bit Unicode)
  - id: title_english
    size: 256
    type: str
    encoding: UTF-16LE
    doc: Title 1 English (128 characters, 16bit Unicode)
  - id: title_french
    size: 256
    type: str
    encoding: UTF-16LE
    doc: Title 2 French (128 characters, 16bit Unicode)
  - id: title_german
    size: 256
    type: str
    encoding: UTF-16LE
    doc: Title 3 German (128 characters, 16bit Unicode)
  - id: title_italian
    size: 256
    type: str
    encoding: UTF-16LE
    doc: Title 4 Italian (128 characters, 16bit Unicode)
  - id: title_spanish
    size: 256
    type: str
    encoding: UTF-16LE
    doc: Title 5 Spanish (128 characters, 16bit Unicode)
  - id: padding
    size: 0x1C0
    doc: Unused/padding (FFh-filled) in Version 0001hr