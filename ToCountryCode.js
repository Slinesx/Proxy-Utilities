function operator(proxies) {
	const ISOFlags = {
        '🇦🇩': ['AD', 'AND'],
        '🇦🇪': ['AE', 'ARE'],
        '🇦🇫': ['AF', 'AFG'],
        '🇦🇱': ['AL', 'ALB'],
        '🇦🇲': ['AM', 'ARM'],
	'🇦🇴': ['AO', 'AGO'],
        '🇦🇶': ['AQ', 'ATA'],
        '🇦🇷': ['AR', 'ARG'],
        '🇦🇹': ['AT', 'AUT'],
        '🇦🇺': ['AU', 'AUS'],
	'🇦🇼': ['AW', 'ABW'],
        '🇦🇿': ['AZ', 'AZE'],
        '🇧🇦': ['BA', 'BIH'],
	'🇧🇧': ['BB', 'BRB'],
        '🇧🇩': ['BD', 'BGD'],
        '🇧🇪': ['BE', 'BEL'],
        '🇧🇬': ['BG', 'BGR'],
        '🇧🇭': ['BH', 'BHR'],
	'🇧🇲': ['BM', 'BMU'],
	'🇧🇳': ['BN', 'BRN'],
	'🇧🇴': ['BO', 'BOL'],
        '🇧🇷': ['BR', 'BRA'],
        '🇧🇸': ['BS', 'BHS'], 
	'🇧🇹': ['BT', 'BTN'],
        '🇧🇾': ['BY', 'BLR'],
        '🇧🇿': ['BZ', 'BLZ'],
        '🇨🇦': ['CA', 'CAN'],
        '🇨🇭': ['CH', 'CHE'],
        '🇨🇱': ['CL', 'CHL'],
        '🇨🇴': ['CO', 'COL'],
        '🇨🇷': ['CR', 'CRI'],
	'🇨🇺': ['CU', 'CUB'],
        '🇨🇾': ['CY', 'CYP'],
        '🇨🇿': ['CZ', 'CZE'],
        '🇩🇪': ['DE', 'DEU'],
        '🇩🇯': ['DJ', 'DJI'],
        '🇩🇰': ['DK', 'DNK'],
        '🇩🇿': ['DZ', 'DZA'],
        '🇪🇨': ['EC', 'ECU'],
        '🇪🇪': ['EE', 'EST'],
        '🇪🇬': ['EG', 'EGY'],
	'🇫🇯': ['FJ', 'FJI'],
        '🇪🇸': ['ES', 'ESP'],
        '🇫🇮': ['FI', 'FIN'],
        '🇫🇷': ['FR', 'FRA'],
        '🇬🇧': ['GB', 'GBR'],
        '🇬🇪': ['GE', 'GEO'],
        '🇬🇭': ['GH', 'GHA'],
	'🇬🇱': ['GL', 'GRL'],
        '🇬🇷': ['GR', 'GRC'],
	'🇬🇹': ['GT', 'GTM'],
	'🇬🇺': ['GU', 'GUM'],
        '🇭🇰': ['HK', 'HKG'],
        '🇭🇷': ['HR', 'HRV'],
	'🇭🇹': ['HT', 'HTI'],
        '🇭🇺': ['HU', 'HUN'],
	'🇮🇩': ['ID', 'IDN'],
        '🇮🇪': ['IE', 'IRL'],
        '🇮🇱': ['IL', 'ISR'],
        '🇮🇲': ['IM', 'IMN'],
        '🇮🇳': ['IN', 'IND'],
	'🇮🇶': ['IQ', 'IRQ'],
        '🇮🇷': ['IR', 'IRN'],
        '🇮🇸': ['IS', 'ISL'],
	'🇮🇹': ['IT', 'ITA'],
	'🇯🇪': ['JE', 'JEY'],
        '🇯🇴': ['JO', 'JOR'],
        '🇯🇵': ['JP', 'JPN'],
        '🇰🇪': ['KE', 'KEN'],
        '🇰🇬': ['KG', 'KGZ'],
        '🇰🇭': ['KH', 'KGZ'],
        '🇰🇵': ['KP', 'PRK'],
        '🇰🇷': ['KR', 'KOR'],
	'🇰🇾': ['KY', 'CYM'],
        '🇰🇿': ['KZ', 'KAZ'],
	'🇱🇦': ['LA', 'LAO'],
	'🇱🇮': ['LI', 'LIE'],
	'🇱🇰': ['LK', 'LKA'],
	'🇱🇹': ['LT', 'LTU'],
        '🇱🇺': ['LU', 'LUX'],
        '🇱🇻': ['LV', 'LVA'],
        '🇲🇦': ['MA', 'MAR'],
	'🇲🇨': ['MC', 'MCO'],
        '🇲🇩': ['MD', 'MDA'],
	'🇲🇪': ['ME', 'MNE'],
        '🇳🇬': ['NG', 'NGA'],
        '🇲🇰': ['MK', 'MKD'],
	'🇲🇲': ['MM', 'MMR'], 
        '🇲🇳': ['MN', 'MNG'],
        '🇲🇴': ['MO', 'MAC'],
        '🇲🇹': ['MT', 'MLT'],
	'🇲🇺': ['MU', 'MUS'],
        '🇲🇽': ['MX', 'MEX'],
        '🇲🇾': ['MY', 'MYS'],
        '🇳🇱': ['NL', 'NLD'],
        '🇳🇴': ['NO', 'NOR'],
        '🇳🇵': ['NP', 'NPL'],
        '🇳🇿': ['NZ', 'NZL'],
	'🇴🇲': ['OM', 'OMN'],
        '🇵🇦': ['PA', 'PAN'],
        '🇵🇪': ['PE', 'PER'],
        '🇵🇭': ['PH', 'PHL'],
        '🇵🇰': ['PK', 'PAK'],
        '🇵🇱': ['PL', 'POL'],
	'🇵🇳': ['PN', 'PCN'],
        '🇵🇷': ['PR', 'PRI'],
        '🇵🇹': ['PT', 'PRT'],
        '🇵🇾': ['PY', 'PRY'],
	'🇶🇦': ['QA', 'QAT'],
        '🇷🇴': ['RO', 'ROU'],
        '🇷🇸': ['RS', 'SRB'],
        '🇷🇪': ['RE', 'REU'],
        '🇷🇺': ['RU', 'RUS'],
        '🇸🇦': ['SA', 'SAU'],
        '🇸🇪': ['SE', 'SWE'],
        '🇸🇬': ['SG', 'SGP'],
        '🇸🇮': ['SI', 'SVN'],
        '🇸🇰': ['SK', 'SVK'],
	'🇸🇾': ['SY', 'SYR'],
        '🇹🇭': ['TH', 'THA'],
        '🇹🇳': ['TN', 'TUN'],
        '🇹🇷': ['TR', 'TUR'],
        '🇹🇼': ['TW', 'TWN'],
	'🇨🇳': ['TW', 'TWN'],
        '🇺🇦': ['UA', 'UKR'],
        '🇺🇿': ['UZ', 'UZB'],
        '🇺🇸': ['US', 'USA'],
        '🇺🇾': ['UY', 'URY'],
	'🇻🇦': ['VA', 'VAT'],
        '🇻🇪': ['VE', 'VEN'],
	'🇻🇬': ['VG', 'VGB'],
        '🇻🇳': ['VN', 'VNM'],
        '🇿🇦': ['ZA', 'ZAF'],
        //'🇨🇳': ['CN', 'CHN'],
    };
    const counter = {};
        return proxies.map(p => {
		var mt = p.name.match(/^[0-9]*(\.)*[0-9]*(?=X)/)?.[0] || "1"
		mt = parseFloat(mt)
		let warn = ''
		if (mt > 1){
		    warn = '  ⚠️'
		}
		let Flag = p.name.match(/[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/)?.[0] || '🏴‍☠️';
		if (Flag != '🏴‍☠️'){
			let keywords = ISOFlags[Flag][1];
			p.name = `${Flag} ${keywords}•|`;
                }
                if (!counter[p.name]) counter[p.name] = 0;       
                p.name = p.name + " " +(('000'+ ++counter[p.name]).slice(-2)).toString();
		p.name = p.name + warn
		return p;
	});
}
