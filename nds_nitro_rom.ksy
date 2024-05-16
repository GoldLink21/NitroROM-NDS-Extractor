meta:
  id: nds_nitro_rom
  title: Nintendo DS Nitro Rom
  application: NDS
  file-extension:
    - nds
  imports:
    - nds_nitro_rom_header
    - nds_icon_title
    - nitro_fnt
  encoding: ASCII
  endian: le
doc: |
  This is the format for Nintendo DS internal ROM storage
seq:
  - id: header
    type: nds_nitro_rom_header
  - id: arm9_ram
    size: header.len_arm9
instances:
  icon_title:
    pos: header.icon_offset
    type: nds_icon_title
  unread:
    pos: 0x1000
    size: 0x3000
  secure_area:
    pos: 0x4000
    size: 0x3000
  arm9_rom:
    pos: header.arm9_rom_offset
    size: header.len_arm9
  arm7_rom:
    pos: header.arm7_rom_offset
    size: header.len_arm7
  fnt:
    pos: header.fnt_offset
    type: nitro_fnt
    # size: header.len_fnt
  fat:
    pos: header.fat_offset
    size: header.len_fat
  # Icon offset: 00 04 23 00
  # len_rom_header: 00 40 00 00
