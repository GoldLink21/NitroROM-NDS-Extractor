kaitai-struct-compiler full_nitro_rom.ksy -t javascript --outdir js
kaitai-struct-compiler nsarc.ksy -t javascript --outdir js
node js/dqix_tool.js "$@"