meta:
  id: nsarc
  title: Nintendo DS Nitro Rom
  application: NDS
  file-extension:
    - nsarc
    - chr
    - ambl
    - ambj
    - mse

  encoding: ASCII
  endian: le
doc: |
  This format assumes that the fnt has no folders
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
  - id: num_entries
    type: u2
    doc: Number of Files
  - id: reserved
    type: u2
  - id: fat
    type: nsarc_fat(num_entries)
  - id: btnf
    contents: "BTNF"
    doc: Chunk Name "BTNF" (File Name Table Block)
  - id: btnf_len
    type: u4
    doc: Chunk Size (including above chunk name)
  - id: fnt
    type: fnt_base(num_entries)
    size: btnf_len - 8
  # - id: padding
    # size: (4 - _io.pos) % 4
  - id: gmif
    contents: "GMIF"
  - id: gmif_len
    type: u4
  - id: img
    size: gmif_len - 8

types:
  nsarc_fat:
    params:
      - id: num_entries
        type: u2
    seq:
      - id: entries
        type: fat_entry(_index)
        repeat: expr
        repeat-expr: num_entries
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
      # file_name:
        # value: _root.fnt.subtables[0].entries[i].file_name
      file:
        pos: file_start
        size: file_end - file_start
      


  fnt_base:
    params:
      - id: num_entries
        type: u4
    seq:
      - id: offset_of_subtable
        type: u4
      - id: first_file_pos
        type: u2
      - id: num_subtables
        type: u2
        # valid: 1
    instances:
      subtables:
        pos: offset_of_subtable
        type: fnt_subtable
        repeat: expr
        repeat-expr: num_subtables

  fnt_subtable:
    seq:
      - id: entries
        type: fnt_sub_entry
        repeat: expr
        repeat-expr: _parent.num_entries


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
        size: type_or_len # & 0b01111111
        type: str
        doc: | 
          File or Sub-Directory Name, case-sensitive, without any ending
          zero, ASCII 20h..7Eh, except for characters \/?"<>*:;|
      # - id: parent_dir_id
      #   type: u2
      #   if: type_or_len & 0b10000000 != 0
      #   doc: Sub-Directory ID (F001h..FFFFh) ;see FNT+(ID AND FFFh)*8
      