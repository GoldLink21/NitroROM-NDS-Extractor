meta:
  id: nsarc
  title: Nintendo DS Nitro Rom
  application: NDS
  file-extension:
    - nsarc
  encoding: ASCII
  endian: le

seq:
  - id: magic
    contents: "NARC"
    doc: Chunk Name "NARC" (Nitro Archive) 
  - id: byte_order
    contents: [0xFE, 0xFF]
    doc: Byte Order (FFFEh) (unlike usually, not FEFFh)
  - id: version
    type: u2
    doc: Version (0100h) 
  - id: file_len
    type: u4
    doc: File Size (from "NARC" ID to end of file)
  - id: header_len
    type: u2
    doc: Chunk Size (0010h)
  - id: chunk_count
    type: u2
    doc: Number of following chunks (0003h)
  - id: btaf
    contents: "BTAF"
    doc: Chunk Name "BTAF" (File Allocation Table Block)
  - id: fat_len
    type: u4
    doc: Chunk Size (including above chunk name)
  - id: file_count
    type: u4
    doc: Number of Files
  # - id: reserved
    # type: u2
    # doc: Reserved (0000h)
  - id: fat
    # size: fat_len
    type: nsarc_fat(file_count)
  - id: btnf
    contents: "BTNF"
    doc: Chunk Name "BTNF" (File Name Table Block)
  - id: btnf_len
    type: u4
    doc: Chunk Size (including above chunk name)
  - id: fnt
    type: nsarc_fnt_base(file_count)
    size: btnf_len
  # - id: gmif
    # contents: "GMIF"


types:
  nsarc_fat:
    params:
      - id: file_count
        type: u2
    seq:
      - id: entries
        type: fat_entry
        repeat: expr
        repeat-expr: file_count
  fat_entry:
    seq:
      - id: file_start
        type: u4
      - id: file_end
        type: u4

  nsarc_fnt_base:
    params:
      - id: file_count
        type: u4
    seq:
      - id: offset_of_subtable
        type: u4
      - id: first_file_pos
        type: u2
      - id: dir_count
        type: u2
    instances:
      subtables:
        pos: offset_of_subtable
        # size: 
        type: fnt_subtable
        repeat: expr
        repeat-expr: file_count

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
        # The size is dependent on type_or_len & 0b01111111
        size: type_or_len & 0b01111111
        type: str
        doc: | 
          File or Sub-Directory Name, case-sensitive, without any ending
          zero, ASCII 20h..7Eh, except for characters \/?"<>*:;|
      - id: parent_dir_id
        type: u2
        if: type_or_len & 0b10000000 != 0
        doc: Sub-Directory ID (F001h..FFFFh) ;see FNT+(ID AND FFFh)*8

