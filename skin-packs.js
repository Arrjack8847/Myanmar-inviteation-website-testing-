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
      floral:'18_hanging_flower_sprig.png',
      divider:'31_gold_ornamental_divider.png',
      corner:'32_gold_corner_ornament.png'
    },
    'moonlit-amethyst': {
      label:'Moonlit Amethyst',
      hero:{png:'skins/moonlit-amethyst/gateway.png',webp:'skins/moonlit-amethyst/gateway.webp'},
      family:{png:'skins/moonlit-amethyst/family.png',webp:'skins/moonlit-amethyst/family.webp'},
      events:{png:'skins/moonlit-amethyst/events.png',webp:'skins/moonlit-amethyst/events.webp'},
      floral:'skins/moonlit-amethyst/floral.png',
      envelope:'skins/moonlit-amethyst/envelope.png',
      seal:'skins/moonlit-amethyst/seal.png',
      butterfly:{
        left:'skins/moonlit-amethyst/butterfly-left.png',
        right:'skins/moonlit-amethyst/butterfly-right.png',
        body:'skins/moonlit-amethyst/butterfly-body.png'
      },
      leaves:[
        'skins/moonlit-amethyst/leaf-1.png',
        'skins/moonlit-amethyst/leaf-2.png',
        'skins/moonlit-amethyst/leaf-3.png',
        'skins/moonlit-amethyst/leaf-4.png',
        'skins/moonlit-amethyst/leaf-5.png',
        'skins/moonlit-amethyst/leaf-6.png'
      ],
      divider:'skins/moonlit-amethyst/divider.png',
      corner:'skins/moonlit-amethyst/corner.png'
    }
  }
};