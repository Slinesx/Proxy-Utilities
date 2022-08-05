function filter(proxies) {
        let index = parseInt(proxies.length/2 * -1)
	return proxies.slice(index + 1)
}
