export default function handleOrgNameLength(name: string) {
	return name && name.length > 45 ? `${name.slice(0, 29)}...` : name;
}
