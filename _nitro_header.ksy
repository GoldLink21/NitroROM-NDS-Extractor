meta:
  id: nitro_header
  title: Nitro DS File header
  endian: le
  encoding: ASCII
seq:
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
enum:
  nitro_identifier:

    # 0x304C444D: MLD0
    # 0x30584554: TEX0
    # 0x30544E4A: JNT0
    # 0x30544150: PAT0
  nitro_files:
    0x54414453: SDAT