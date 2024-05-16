meta:
  id: nitro_fnt
  encoding: ASCII
  endian: le
doc: NitroROM File Name Table (FNT)
seq:
  - id: offset_of_subtable
    type: u4
  - id: first_subtable_id
    type: u2
  - id: len_subtables
    type: u2
  - id: subtables
    type: subtable
    repeat: expr
    repeat-expr: len_subtables
types: 
  subtable:
    seq:
      - id: type_or_len
        type: u1
        doc: |
          01h..7Fh File Entry          (Length=1..127, without ID field)
          81h..FFh Sub-Directory Entry (Length=1..127, plus ID field)
          00h      End of Sub-Table
          80h      Reserved
      - id: file_name
        # The size is dependent on type_or_len
        size: type_or_len & 0b01111111
        type: str
        doc: | 
          File or Sub-Directory Name, case-sensitive, without any ending
          zero, ASCII 20h..7Eh, except for characters \/?"<>*:;|
