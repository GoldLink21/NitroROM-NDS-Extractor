# TODO
meta:
  id: nds_icon
  doc: Icon Bitmap  (32x32 pix) (4x4 tiles, 4bit depth) (4x8 bytes/tile)
seq:
  - id: icon_bitmap
    size: 0x200
    doc: Icon Bitmap  (32x32 pix) (4x4 tiles, 4bit depth) (4x8 bytes/tile)
  - id: icon_palette
    size: 0x20
    doc: Icon Palette (16 colors, 16bit, range 0000h-7FFFh). (Color 0 is transparent, so the 1st palette entry is ignored)
types:
  pixel:
    seq:
      - id: abc
        size: 4 * 8
        doc: 
  color:
    seq:
      - id: 
  icon:
    seq:
      - id: pixels
        size: 32 * 32
        type: pixel
  palette:
    seq:
      - id: colors
        size: 
