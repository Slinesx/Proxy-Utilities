function filter(proxies) {
        let count = 1
        let max = parseInt(proxies.length/2)
	return proxies.map(p => {
		return count++ < max;
	});
}
