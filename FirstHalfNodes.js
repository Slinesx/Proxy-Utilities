function filter(proxies) {
        let index = parseInt(proxies.length/2)
        let count = 1
	return proxies.map(p => {
		return count++ < index;
	})
}
