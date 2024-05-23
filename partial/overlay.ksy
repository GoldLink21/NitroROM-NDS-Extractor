meta:
  id: nds_overlay
  title: Nintendo DS Nitro Rom
  application: NDS
  file-extension:
    - nds
  encoding: ASCII
  endian: le
# 00h  4    Overlay ID
# 04h  4    RAM Address ;Point at which to load
# 08h  4    RAM Size    ;Amount to load
# 0Ch  4    BSS Size    ;Size of BSS data region
# 10h  4    Static initialiser start address
# 14h  4    Static initialiser end address
# 18h  4    File ID  (0000h..EFFFh)
# 1Ch  4    Reserved (zero)
seq:
  - id: overlays
    repeat: eos
    type: overlay

types:
  overlay:
    seq:
      - id: overlay_id
        type: u4
      - id: ram_address
        type: u4
      - id: ram_len
        type: u4
      - id: bss_len
        type: u4
      - id: static_init_start_address
        type: u4
      - id: static_init_end_address
        type: u4
      - id: file_id
        type: u4
      - id: reserved
        size: 4
