// Source-led image polish within approved I-03-C. Let photographic plates grow to show the complete composition.
export const imageFramingCSS=`
.i03.ref-c :is(.folio-photo .hero-image,.program-item img,.collection-item img,.room-grid img,.proof-photo img,.evidence-strip img){
 width:100%;height:auto!important;max-height:none!important;aspect-ratio:auto!important;
 max-width:min(100%,var(--source-width,100%));object-fit:contain;object-position:50% 50%;
 background:transparent;display:block;margin-inline:auto;
}
.i03.ref-c .proof-photo{height:auto!important;min-height:0;align-self:start}
.i03.ref-c .comparison{height:auto;min-height:0;width:min(100%,620px);aspect-ratio:3/4;margin-inline:auto;background:var(--surface)}
.i03.ref-c .comparison img{object-fit:contain;object-position:50% 50%}
.i03.ref-c .finish-item img{object-fit:contain;background:var(--surface)}
@media(max-width:767px){
.i03.ref-c .comparison{width:100%;height:auto;aspect-ratio:3/4;min-height:0}
}
`;
