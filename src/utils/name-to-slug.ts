export const nameToSlug = (name: string) => ({
	name: name,
	slug: name.trim().replace(/ +/g, '-').toLowerCase()
})
