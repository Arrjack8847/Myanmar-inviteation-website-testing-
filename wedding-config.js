/* Edit ONLY this file to personalize a customer's invitation.
 * Empty objects preserve clearly labelled demonstration values.
 * Replace placeholders with confirmed information before publishing.
 * Choose a registered art pack: golden-autumn or, once generated, moonlit-amethyst.
 */
'use strict';
window.WEDDING_CUSTOMIZATION = {
  skin: 'golden-autumn',
  couple: {
    // firstName: 'First name', secondName: 'Second name',
    // firstFamily: 'First family', secondFamily: 'Second family',
    // weddingDateISO: '2027-06-20T16:30:00+06:30',
    // displayDate: '20 JUNE 2027',
  },
  story: {
    // introduction: 'A genuine, couple-approved introduction.',
    // chapters: [{title:'How we met',text:'Confirmed story'}, ...]
  },
  events: {
    ceremony: {
      // venue: 'Confirmed venue', address: 'Full address',
      // venueConfirmed: true, mapUrl: 'https://maps.google.com/...'
    },
    reception: {}
  },
  gallery: {
    // The first couple name in couple.firstName belongs to the bride;
    // couple.secondName belongs to the groom. Override names here if needed.
    bride: {
      // name: 'Approved bride name',
      // photo: 'photos/bride.webp',
      // caption: 'Optional caption'
    },
    groom: {
      // name: 'Approved groom name',
      // photo: 'photos/groom.webp',
      // caption: 'Optional caption'
    },
    // The photo gallery accepts up to eight approved local images.
    // Upload them to photos/ before enabling them here.
    photos: [
      // { src: 'photos/moment-01.webp', alt: 'Couple standing in the garden',
      //   caption: 'A cherished moment' }
    ]
  }
};
