meta:
  id: nds_nitro_rom_header
  title: Nintendo DS Nitro ROM Header
  endian: le
  encoding: ASCII
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
    valid:
      eq: 0x4000
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
    # valid:
      # eq: {0,0,0,0,0,0,0,0,0,0,0,0,0}
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