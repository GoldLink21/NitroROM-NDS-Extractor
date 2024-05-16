meta: 
  id: nitro_sdat
  title: Nitro DS SDAT file
  endian: le
  encoding: ASCII
seq:
  - id: header
    type: sdat_header
  - id: symbol
    type: sdat_symbol
  - id: info
    type: sdat_info
  - id: fat
    type: sdat_fat
  - id: data
    type: sdat_data
types:
  sdat_header:
      - id: file_type
        type: u4
        enum: nitro_files
      - id: magic
        type: u4
        doc: 0x0100feff or 0x0100fffe
      - id: len_file
        type: u4
      - id: len_header
        type: u2
        valid:
          eq: 16
        doc: The size of this header. Always 16
      - id: num_blocks
        type: u2
        doc: Number of blocks
  sdat_symbol:
  sdat_info:
  sdat_fat:
  sdat_data: