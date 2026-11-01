/* Artwork-only skins; wedding information and motion live elsewhere. */
'use strict';
window.INVITATION_SKINS = {
  defaultId: 'golden-autumn',
  packs: {
    'golden-autumn': {
      label: 'Golden Autumn Heritage',
      hero: {png:'art/golden_autumn_heritage_master_v4.png', webp:'art/golden_autumn_heritage_master_v4.webp'},
      family: {png:'art/section2_family_invitation_master.png', webp:'art/section2_family_invitation_master.webp'},
      events: {png:'art/section3_ceremony_reception_master.png', webp:'art/section3_ceremony_reception_master.webp'},
      envelope: '29_opening_invitation_card.png',
      seal: '30_wax_seal.png',
      butterfly: {
        left:'21_butterfly_left_wing.png',right:'22_butterfly_right_wing.png',body:'20_butterfly_body.png'
      },
      leaves: [
        '23_leaf_golden_teak.png','24_leaf_copper_teak.png','25_leaf_burgundy_teak.png',
        '26_leaf_golden_bodhi.png','27_leaf_orange_bodhi.png','28_leaf_small_russet.png'
      ],
      divider:'31_gold_ornamental_divider.png',
      corner:'32_gold_corner_ornament.png'
    }
  }
};