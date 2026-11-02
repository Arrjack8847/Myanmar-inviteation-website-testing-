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
  // Bride and groom portraits are optional. Keep approved images under
  // photos/bride.webp and photos/groom.webp in each customer's deployment.
  // When photo is omitted, a beautiful monogram appears instead.
  people: {
    bride: {
      // bio: 'Couple-approved introduction to the bride.',
      // photo: 'photos/bride.webp',
    },
    groom: {
      // bio: 'Couple-approved introduction to the groom.',
      // photo: 'photos/groom.webp',
    }
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
  }
};
