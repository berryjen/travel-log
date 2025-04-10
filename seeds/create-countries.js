/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function seed(knex) {
  // Deletes ALL existing entries
  await knex('countries').del();
  await knex('countries').insert([
    {
      id: 1,
      name: 'Ascension Island',
    },
    {
      id: 2,
      name: 'Andorra',
    },
    {
      id: 3,
      name: 'United Arab Emirates',
    },
    {
      id: 4,
      name: 'Afghanistan',
    },
    {
      id: 5,
      name: 'Antigua and Barbuda',
    },
    {
      id: 6,
      name: 'Anguilla',
    },
    {
      id: 7,
      name: 'Albania',
    },
    {
      id: 8,
      name: 'Armenia',
    },
    {
      id: 9,
      name: 'Netherlands Antilles',
    },
    {
      id: 10,
      name: 'Angola',
    },
    {
      id: 11,
      name: 'Antarctica',
    },
    {
      id: 12,
      name: 'Argentina',
    },
    {
      id: 13,
      name: 'American Samoa',
    },
    {
      id: 14,
      name: 'Austria',
    },
    {
      id: 15,
      name: 'Australia',
    },
    {
      id: 16,
      name: 'Aruba',
    },
    {
      id: 17,
      name: 'Azerbaijan',
    },
    {
      id: 18,
      name: 'Bosnia and Herzegovina | Bosnia',
    },
    {
      id: 19,
      name: 'Barbados',
    },
    {
      id: 20,
      name: 'Bangladesh',
    },
    {
      id: 21,
      name: 'Belgium',
    },
    {
      id: 22,
      name: 'Burkina Faso',
    },
    {
      id: 23,
      name: 'Bulgaria',
    },
    {
      id: 24,
      name: 'Bahrain',
    },
    {
      id: 25,
      name: 'Burundi',
    },
    {
      id: 26,
      name: 'Benin',
    },
    {
      id: 27,
      name: 'Bermuda',
    },
    {
      id: 28,
      name: 'Brunei Darussalam | Brunei',
    },
    {
      id: 29,
      name: 'Bolivia',
    },
    {
      id: 30,
      name: 'Brazil',
    },
    {
      id: 31,
      name: 'Bahamas',
    },
    {
      id: 32,
      name: 'Bhutan',
    },
    {
      id: 33,
      name: 'Bouvet Island',
    },
    {
      id: 34,
      name: 'Botswana',
    },
    {
      id: 35,
      name: 'Belarus',
    },
    {
      id: 36,
      name: 'Belize',
    },
    {
      id: 37,
      name: 'Canada',
    },
    {
      id: 38,
      name: 'Cocos Islands | Keeling Islands',
    },
    {
      id: 39,
      name: 'Democratic Republic of Congo',
    },
    {
      id: 40,
      name: 'Central African Republic',
    },
    {
      id: 41,
      name: 'Congo',
    },
    {
      id: 42,
      name: 'Switzerland',
    },
    {
      id: 43,
      name: 'Cote D\'Ivoire | Ivory Coast | Cote d\'Ivoire',
    },
    {
      id: 44,
      name: 'Cook Islands',
    },
    {
      id: 45,
      name: 'Chile',
    },
    {
      id: 46,
      name: 'Cameroon',
    },
    {
      id: 47,
      name: 'China',
    },
    {
      id: 48,
      name: 'Colombia',
    },
    {
      id: 49,
      name: 'Costa Rica',
    },
    {
      id: 50,
      name: 'Cuba',
    },
    {
      id: 51,
      name: 'Cape Verde',
    },
    {
      id: 52,
      name: 'Christmas Island',
    },
    {
      id: 53,
      name: 'Cyprus',
    },
    {
      id: 54,
      name: 'Czech Republic',
    },
    {
      id: 55,
      name: 'Germany',
    },
    {
      id: 56,
      name: 'Djibouti',
    },
    {
      id: 57,
      name: 'Denmark',
    },
    {
      id: 58,
      name: 'Dominica',
    },
    {
      id: 59,
      name: 'Dominican Republic',
    },
    {
      id: 60,
      name: 'Algeria',
    },
    {
      id: 61,
      name: 'Ecuador',
    },
    {
      id: 62,
      name: 'Estonia',
    },
    {
      id: 63,
      name: 'Egypt',
    },
    {
      id: 64,
      name: 'Western Sahara',
    },
    {
      id: 65,
      name: 'Eritrea',
    },
    {
      id: 66,
      name: 'Spain',
    },
    {
      id: 67,
      name: 'Ethiopia',
    },
    {
      id: 68,
      name: 'European Union',
    },
    {
      id: 69,
      name: 'Finland',
    },
    {
      id: 70,
      name: 'Fiji',
    },
    {
      id: 71,
      name: 'Falkland Islands | Malvinas',
    },
    {
      id: 72,
      name: 'Micronesia',
    },
    {
      id: 73,
      name: 'Faroe Islands',
    },
    {
      id: 74,
      name: 'France',
    },
    {
      id: 75,
      name: 'Gabon',
    },
    {
      id: 76,
      name: 'Great Britain | UK | England | Scotland | Wales | Northern Ireland | United Kingdom',
    },
    {
      id: 77,
      name: 'Grenada',
    },
    {
      id: 78,
      name: 'Georgia',
    },
    {
      id: 79,
      name: 'French Guiana',
    },
    {
      id: 80,
      name: 'Ghana',
    },
    {
      id: 81,
      name: 'Gibraltar',
    },
    {
      id: 82,
      name: 'Greenland',
    },
    {
      id: 83,
      name: 'Gambia',
    },
    {
      id: 84,
      name: 'Guinea',
    },
    {
      id: 85,
      name: 'Guadeloupe',
    },
    {
      id: 86,
      name: 'Equatorial Guinea',
    },
    {
      id: 87,
      name: 'Greece',
    },
    {
      id: 88,
      name: 'South Georgia and South Sandwich Islands',
    },
    {
      id: 89,
      name: 'Guatemala',
    },
    {
      id: 90,
      name: 'Guam',
    },
    {
      id: 91,
      name: 'Guinea-Bissau',
    },
    {
      id: 92,
      name: 'Guyana',
    },
    {
      id: 93,
      name: 'Hong Kong',
    },
    {
      id: 94,
      name: 'Heard and McDonald Islands',
    },
    {
      id: 95,
      name: 'Honduras',
    },
    {
      id: 96,
      name: 'Croatia | Hrvatska',
    },
    {
      id: 97,
      name: 'Haiti',
    },
    {
      id: 98,
      name: 'Hungary',
    },
    {
      id: 99,
      name: 'Indonesia',
    },
    {
      id: 100,
      name: 'Ireland',
    },
    {
      id: 101,
      name: 'Israel',
    },
    {
      id: 102,
      name: 'India',
    },
    {
      id: 103,
      name: 'British Indian Ocean Territory',
    },
    {
      id: 104,
      name: 'Iraq',
    },
    {
      id: 105,
      name: 'Iran',
    },
    {
      id: 106,
      name: 'Iceland',
    },
    {
      id: 107,
      name: 'Italy',
    },
    {
      id: 108,
      name: 'Jamaica',
    },
    {
      id: 109,
      name: 'Jordan',
    },
    {
      id: 110,
      name: 'Japan',
    },
    {
      id: 111,
      name: 'Kenya',
    },
    {
      id: 112,
      name: 'Kyrgyzstan',
    },
    {
      id: 113,
      name: 'Cambodia',
    },
    {
      id: 114,
      name: 'Kiribati',
    },
    {
      id: 115,
      name: 'Comoros',
    },
    {
      id: 116,
      name: 'Saint Kitts and Nevis',
    },
    {
      id: 117,
      name: 'North Korea',
    },
    {
      id: 118,
      name: 'South Korea',
    },
    {
      id: 119,
      name: 'Kuwait',
    },
    {
      id: 120,
      name: 'Cayman Islands',
    },
    {
      id: 121,
      name: 'Kazakhstan',
    },
    {
      id: 122,
      name: 'Laos',
    },
    {
      id: 123,
      name: 'Lebanon',
    },
    {
      id: 124,
      name: 'Saint Lucia',
    },
    {
      id: 125,
      name: 'Liechtenstein',
    },
    {
      id: 126,
      name: 'Sri Lanka',
    },
    {
      id: 127,
      name: 'Liberia',
    },
    {
      id: 128,
      name: 'Lesotho',
    },
    {
      id: 129,
      name: 'Lithuania',
    },
    {
      id: 130,
      name: 'Luxembourg',
    },
    {
      id: 131,
      name: 'Latvia',
    },
    {
      id: 132,
      name: 'Libya',
    },
    {
      id: 133,
      name: 'Morocco',
    },
    {
      id: 134,
      name: 'Monaco',
    },
    {
      id: 135,
      name: 'Moldova',
    },
    {
      id: 136,
      name: 'Montenegro',
    },
    {
      id: 137,
      name: 'Madagascar',
    },
    {
      id: 138,
      name: 'Marshall Islands',
    },
    {
      id: 139,
      name: 'F.Y.R.O.M. | Macedonia',
    },
    {
      id: 140,
      name: 'Mali',
    },
    {
      id: 141,
      name: 'Myanmar',
    },
    {
      id: 142,
      name: 'Mongolia',
    },
    {
      id: 143,
      name: 'Macau | Macao',
    },
    {
      id: 144,
      name: 'Northern Mariana Islands',
    },
    {
      id: 145,
      name: 'Martinique',
    },
    {
      id: 146,
      name: 'Mauritania',
    },
    {
      id: 147,
      name: 'Montserrat',
    },
    {
      id: 148,
      name: 'Malta',
    },
    {
      id: 149,
      name: 'Mauritius',
    },
    {
      id: 150,
      name: 'Maldives',
    },
    {
      id: 151,
      name: 'Malawi',
    },
    {
      id: 152,
      name: 'Mexico',
    },
    {
      id: 153,
      name: 'Malaysia',
    },
    {
      id: 154,
      name: 'Mozambique',
    },
    {
      id: 155,
      name: 'Namibia',
    },
    {
      id: 156,
      name: 'New Caledonia',
    },
    {
      id: 157,
      name: 'Niger',
    },
    {
      id: 158,
      name: 'Norfolk Island',
    },
    {
      id: 159,
      name: 'Nigeria',
    },
    {
      id: 160,
      name: 'Nicaragua',
    },
    {
      id: 161,
      name: 'Netherlands',
    },
    {
      id: 162,
      name: 'Norway',
    },
    {
      id: 163,
      name: 'Nepal',
    },
    {
      id: 164,
      name: 'Nauru',
    },
    {
      id: 165,
      name: 'Niue',
    },
    {
      id: 166,
      name: 'New Zealand | Aotearoa',
    },
    {
      id: 167,
      name: 'Oman',
    },
    {
      id: 168,
      name: 'Panama',
    },
    {
      id: 169,
      name: 'Peru',
    },
    {
      id: 170,
      name: 'French Polynesia',
    },
    {
      id: 171,
      name: 'Papua New Guinea',
    },
    {
      id: 172,
      name: 'Philippines',
    },
    {
      id: 173,
      name: 'Pakistan',
    },
    {
      id: 174,
      name: 'Poland',
    },
    {
      id: 175,
      name: 'St. Pierre and Miquelon',
    },
    {
      id: 176,
      name: 'Puerto Rico',
    },
    {
      id: 177,
      name: 'Palestinian Territory',
    },
    {
      id: 178,
      name: 'Portugal',
    },
    {
      id: 179,
      name: 'Palau',
    },
    {
      id: 180,
      name: 'Paraguay',
    },
    {
      id: 181,
      name: 'Qatar',
    },
    {
      id: 182,
      name: 'Reunion',
    },
    {
      id: 183,
      name: 'Romania',
    },
    {
      id: 184,
      name: 'Serbia',
    },
    {
      id: 185,
      name: 'Russian Federation | Russia',
    },
    {
      id: 186,
      name: 'Rwanda',
    },
    {
      id: 187,
      name: 'Saudi Arabia',
    },
    {
      id: 188,
      name: 'Solomon Islands',
    },
    {
      id: 189,
      name: 'Seychelles',
    },
    {
      id: 190,
      name: 'Sudan',
    },
    {
      id: 191,
      name: 'Sweden',
    },
    {
      id: 192,
      name: 'Singapore',
    },
    {
      id: 193,
      name: 'St. Helena',
    },
    {
      id: 194,
      name: 'Slovenia',
    },
    {
      id: 195,
      name: 'Svalbard and Jan Mayen Islands',
    },
    {
      id: 196,
      name: 'Slovak Republic | Slovakia',
    },
    {
      id: 197,
      name: 'Sierra Leone',
    },
    {
      id: 198,
      name: 'San Marino',
    },
    {
      id: 199,
      name: 'Senegal',
    },
    {
      id: 200,
      name: 'Somalia',
    },
    {
      id: 201,
      name: 'Suriname',
    },
    {
      id: 202,
      name: 'Sao Tome and Principe',
    },
    {
      id: 203,
      name: 'El Salvador',
    },
    {
      id: 204,
      name: 'Syria | Syrian Arab Republic',
    },
    {
      id: 205,
      name: 'Swaziland',
    },
    {
      id: 206,
      name: 'Turks and Caicos Islands',
    },
    {
      id: 207,
      name: 'Chad',
    },
    {
      id: 208,
      name: 'French Southern Territories',
    },
    {
      id: 209,
      name: 'Togo',
    },
    {
      id: 210,
      name: 'Thailand',
    },
    {
      id: 211,
      name: 'Tajikistan',
    },
    {
      id: 212,
      name: 'Tokelau',
    },
    {
      id: 213,
      name: 'Turkmenistan',
    },
    {
      id: 214,
      name: 'Tunisia',
    },
    {
      id: 215,
      name: 'Tonga',
    },
    {
      id: 216,
      name: 'Turkey',
    },
    {
      id: 217,
      name: 'Trinidad and Tobago',
    },
    {
      id: 218,
      name: 'Tuvalu',
    },
    {
      id: 219,
      name: 'Taiwan',
    },
    {
      id: 220,
      name: 'Tanzania',
    },
    {
      id: 221,
      name: 'Ukraine',
    },
    {
      id: 222,
      name: 'Uganda',
    },
    {
      id: 223,
      name: 'US Minor Outlying Islands',
    },
    {
      id: 224,
      name: 'United States | USA',
    },
    {
      id: 225,
      name: 'Uruguay',
    },
    {
      id: 226,
      name: 'Uzbekistan',
    },
    {
      id: 227,
      name: 'Vatican City State | Holy See | Vatican',
    },
    {
      id: 228,
      name: 'Saint Vincent and the Grenadines',
    },
    {
      id: 229,
      name: 'Venezuela',
    },
    {
      id: 230,
      name: 'British Virgin Islands',
    },
    {
      id: 231,
      name: 'U.S. Virgin Islands',
    },
    {
      id: 232,
      name: 'Viet Nam | Vietnam',
    },
    {
      id: 233,
      name: 'Vanuatu',
    },
    {
      id: 234,
      name: 'Wallis and Futuna Islands',
    },
    {
      id: 235,
      name: 'Samoa',
    },
    {
      id: 236,
      name: 'Yemen',
    },
    {
      id: 237,
      name: 'Mayotte',
    },
    {
      id: 238,
      name: 'South Africa',
    },
    {
      id: 239,
      name: 'Zambia',
    },
    {
      id: 240,
      name: 'Zimbabwe',
    },
  ]);
};
