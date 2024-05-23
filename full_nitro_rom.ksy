meta:
  id: nds_nitro_rom
  title: Nintendo DS Nitro Rom
  application: NDS
  file-extension:
    - nds
  encoding: ASCII
  endian: le
doc: |
  This is the format for Nintendo DS internal ROM storage
seq:
  - id: header
    type: nds_nitro_rom_header
instances:
  icon_title:
    pos: header.icon_offset
    type: nds_icon_title
  secure_area:
    # This can be encoded or decoded
    pos: 0x4000
    size: 0x3000
  arm7_rom:
    pos: header.arm7_rom_offset
    size: header.len_arm7
  arm9_rom:
    pos: header.arm9_rom_offset
    size: header.len_arm9
  fnt:
    pos: header.fnt_offset
    type: fnt_base_table
    size: header.len_fnt
  fat:
    pos: header.fat_offset
    type: nitro_fat
    size: header.len_fat
  arm9_overlays:
    pos: header.arm9_overlay_offset
    size: header.len_arm9_overlay
    type: overlay_table
  arm7_overlays:
    pos: header.arm7_overlay_offset
    size: header.len_arm7_overlay
    type: overlay_table
  # unread:
    # pos: 0x1000
    # size: 0x3000
  # arm9_ram:
    # pos: header.arm9_
  files:
    type: all_files

types:
  fnt_base_table:
    seq:
      - id: offset_of_subtable
        type: u4
        doc: Starts from base of this table
      - id: first_subtable_id
        type: u2
        doc: First file starts at this index. This depends on how many overlay files there are
      - id: num_subtables
        type: u2
        doc: Only appears in this base table
    instances:
      # Needs to be an instance because of the offset
      subtables:
        pos: offset_of_subtable
        type: fnt_subtable
        repeat: expr
        repeat-expr: num_subtables
  fnt_subtable:
    seq:
      - id: entries
        type: fnt_sub_entry
        repeat: until
        repeat-until: _.type_or_len == 0

      
  fnt_sub_entry:
    seq:
      - id: type_or_len
        type: u1
        doc: |
          01h..7Fh File Entry          (Length=1..127, without ID field)
          81h..FFh Sub-Directory Entry (Length=1..127, plus ID field)
          00h      End of Sub-Table
          80h      Reserved
      - id: file_name
        # type: u8
        # repeat: expr
        # repeat-expr: type_or_len & 0b01111111
        type: str
        size: type_or_len & 0b01111111
        doc: | 
          File or Sub-Directory Name, case-sensitive, without any ending
          zero, ASCII 20h..7Eh, except for characters \/?"<>*:;|
      - id: sub_dir_id
        type: u2
        if: type_or_len & 0b10000000 != 0
        doc: Sub-Directory ID (F001h..FFFFh) ;see FNT+(ID AND FFFh)*8
    # TODO: Figure this out to reference the parent 
    instances:
      sub_dir:
        if: type_or_len & 0b10000000 != 0
        value: _parent._parent.subtables[(sub_dir_id & 0xFFF)]
        doc: The element in the base table that is the sub directory


  nitro_fat:
    seq:
      - id: entries
        type: fat_entry(_index)
        repeat: eos
  fat_entry:
    params:
      - id: i
        type: u4
    seq:
      - id: file_start
        type: u4
      - id: file_end
        type: u4
    instances:
      file:
        io: _root._io
        # type: u1
        pos: file_start
        size: file_end - file_start
        
  nds_icon_title:
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
    - id: icon
      type: icon_bmp
      # This can be removed when it is finished
      # size: 0x200
      doc: Icon Bitmap  (32x32 pix) (4x4 tiles, 4bit depth) (4x8 bytes/tile)
    # - id: icon_palette
      # type: u2
      # repeat: expr
      # repeat-expr: 16
      # doc: Icon Palette (16 colors, 16bit, range 0000h-7FFFh). (Color 0 is transparent, so the 1st palette entry is ignored)
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

  icon_bmp:
    seq:
      - id: tiles_x
        type: icon_tile_strip
        repeat: expr
        repeat-expr: 8
      - id: palette
        type: u2
        repeat: expr
        repeat-expr: 16
        doc: Icon Palette (16 colors, 16bit, range 0000h-7FFFh). (Color 0 is transparent, so the 1st palette entry is ignored)
  icon_tile_strip:
    seq:
      - id: tiles_y
        type: icon_tile
        repeat: expr
        repeat-expr: 4
  icon_tile:
    seq:
      - id: pixels_x
        type: icon_pixel_strip
        repeat: expr
        repeat-expr: 4
  icon_pixel_strip:
    seq:
      - id: pixels_y
        type: icon_pixel
        repeat: expr
        repeat-expr: 4
  icon_pixel:
    seq:
      - id: ci1
        type: b4
      - id: ci2
        type: b4
    instances:
      c1:
        value: _root.icon_title.icon.palette[ci1]
        doc: The color grabbed from the palette
      c2:
        value: _root.icon_title.icon.palette[ci2]
      
  nds_nitro_rom_header:
    seq:
    - id: game_title
      size: 12
      type: str
      doc: Game Title (Uppercase ASCII, padded with 00h)
    - id: game_code
      size: 4
      type: str
      doc: Gamecode (Uppercase ASCII, NTR-<code>) (0=homebrew)
    - id: maker_code
      size: 2
      type: str
      doc: Makercode (Uppercase ASCII, eg. "01"=Nintendo) (0=homebrew)
      # could convert to use an enum, but oh well
    - id: unit_code
      size: 1
      doc: Unitcode (00h=NDS, 02h=NDS+DSi, 03h=DSi) (bit1=DSi)
    - id: encryption_seed
      size: 1
      doc: Encryption Seed Select (00..07h, usually 00h)
    - id: device_capacity
      size: 1
      doc: Devicecapacity (Chipsize = 128KB SHL nn) (eg. 7 = 16MB)
    - id: reserved_1
      size: 8
    - id: nds_region
      size: 1
      doc: NDS Region  (00h=Normal, 80h=China, 40h=Korea) (other on DSi)
    - id: rom_verion
      size: 1
      doc: ROM Version (usually 00h)
    - id: autostart
      size: 1
      doc: Autostart (Bit2 -> Skip "Press Button" after Health and Safety). (Also skips bootmenu, even in Manual mode & even Start pressed)
    - id: arm9_rom_offset
      type: u4
      doc: ARM9 rom_offset (4000h and up, align 1000h)
    - id: arm9_entry_address
      type: u4
      doc: ARM9 entry_address (2000000h..23BFE00h)
    - id: arm9_ram_address
      type: u4
      doc: ARM9 ram_address (2000000h..23BFE00h)
    - id: len_arm9
      type: u4
      doc: ARM9 size (max 3BFE00h) (3839.5KB)
    - id: arm7_rom_offset
      type: u4
      doc: ARM7 rom_offset (8000h and up)
    - id: arm7_entry_address
      type: u4
      doc: ARM7 entry_address (2000000h..23BFE00h, or 37F8000h..3807E00h)
    - id: arm7_ram_address
      type: u4
      doc: ARM7 ram_address (2000000h..23BFE00h, or 37F8000h..3807E00h)
    - id: len_arm7
      type: u4
      doc: ARM7 size (max 3BFE00h, or FE00h) (3839.5KB, 63.5KB)
    - id: fnt_offset
      type: u4
      doc: File Name Table (FNT) offset
    - id: len_fnt
      type: u4
      doc: File Name Table (FNT) size
    - id: fat_offset
      type: u4
      doc: File Allocation Table (FAT) offset
    - id: len_fat
      type: u4
      doc: File Allocation Table (FAT) size
    - id: arm9_overlay_offset
      type: u4
      doc: File ARM9 overlay_offset
    - id: len_arm9_overlay
      type: u4
      doc: File ARM9 overlay_size
    - id: arm7_overlay_offset
      type: u4
      doc: File ARM7 overlay_offset
    - id: len_arm7_overlay
      type: u4
      doc: File ARM7 overlay_size
    - id: port_normal_command
      type: u4
      doc: Port 40001A4h setting for normal commands (usually 00586000h)
    - id: port_key1_command
      type: u4
      doc: Port 40001A4h setting for KEY1 commands (usually 001808F8h)
    - id: icon_offset
      type: u4
      doc: Icon/Title offset (0=None) (8000h and up)
    - id: secure_area_checksum
      type: u2
      doc: Secure Area Checksum, CRC-16 of [[020h]..00007FFFh]
    - id: secure_area_delay
      type: u2
      doc: Secure Area Delay (in 131kHz units) (051Eh=10ms or 0D7Eh=26ms)
    - id: arm9_autoload_list
      type: u4
      doc: ARM9 Auto Load List Hook RAM Address (?) ;\endaddr of auto-load
    - id: arm7_autoload_list
      type: u4
      doc: ARM7 Auto Load List Hook RAM Address (?) ;/functions
    - id: secure_area_disable
      size: 8
      doc: Secure Area Disable (by encrypted "NmMdOnly") (usually zero)
    - id: len_rom
      type: u4
      doc: Total Used ROM size (remaining/unused bytes usually FFh-padded)
    - id: len_rom_header
      type: u4
      # valid: 0x4000
      doc: ROM Header Size (4000h)
    - id: unknown_1
      size: 4
      doc: Unknown, some rom_offset, or zero? (DSi -> slightly different)
    - id: reserved_2
      size: 8
      doc: Reserved (zero filled; except, [88h..93h] used on DSi)
    - id: nand_rom_end
      type: u2
      doc: NAND end of ROM area  ;\in 20000h-byte units (DSi -> 80000h-byte)
    - id: nand_rw_start
      type: u2
      doc: NAND start of RW area ;/usually both same address (0=None)
    - id: reserved_3
      size: 0x18
      doc: Reserved (zero filled)
      # Not exactly needed, but why not
      contents: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    - id: reserved_4
      size: 0x10
      doc: Reserved (zero filled; or "DoNotZeroFillMem"=unlaunch fastboot)
    - id: nintendo_logo
      size: 0x9C
      doc: Nintendo Logo (compressed bitmap, same as in GBA Headers)
    - id: nintendo_logo_checksum
      size: 2
      contents: [0x56, 0xCF]
      doc: Nintendo Logo Checksum, CRC-16 of [0C0h-15Bh], fixed CF56h
    - id: header_checksum
      size: 2
      doc: Header Checksum, CRC-16 of [000h-15Dh]
    - id: debug_rom_offset
      size: 4
      doc: Debug rom_offset (0=none) (8000h and up) ;only if debug
    - id: debug_size
      size: 4
      doc: Debug size (0=none) (max 3BFE00h) ;version with
    - id: debug_ram_address
      size: 4
      doc: Debug ram_address (0=none) (2400000h..27BFE00h) ;SIO and 8MB
    - id: reserved_5
      size: 4
      doc: Reserved (zero filled) (transferred, and stored, but not used)
    - id: reserved_6
      size: 0x90
      doc: Reserved (zero filled) (transferred, but not stored in RAM)
    - id: reserved_7
      size: 0xE00
      doc: Reserved (zero filled) (usually not transferred)

  overlay_table:
    seq:
      - id: overlays
        repeat: eos
        type: overlay_entry
    doc: Holds all the entries for the overlay table

  overlay_entry:
    seq:
      - id: overlay_id
        type: u4
        doc: The ID of the overlay table
      - id: ram_address
        type: u4
        doc: RAM Address ;Point at which to load
      - id: len_file
        type: u4
        doc: RAM Size    ;Amount to load
      - id: bss_len
        type: u4
        doc: BSS Size    ;Size of BSS data region
      - id: static_init_start_address
        type: u4
        doc: Static initialiser start address
      - id: static_init_end_address
        type: u4
        doc: Static initialiser end address
      - id: file_id
        type: u4
        doc: File ID  (0000h..EFFFh)
      - id: reserved
        size: 4
        doc: Usually zero filled
    instances:
      # TODO: Verify this
      file:
        io: _root._io
        pos: ram_address
        size: len_file

  all_files:
    instances:
      files:
        type: file_entry(_index)
        repeat: expr
        repeat-expr: _root.fat.entries.size
        

  file_entry:
    params:
      - id: index
        type: u4
    instances:
      # fnt:
        # This is much harder to calculate
        # io: _root.fnt
      data:
        value: _root.fat.entries[index].file
      file_size:
        value: _root.fat.entries[index].file.size
