// Resolve brand asset URLs. Consumers may set window.SCHMIDT_ASSET_BASE (default "assets").
export const assetBase = () => (typeof window !== 'undefined' && window.SCHMIDT_ASSET_BASE) || 'assets';
export const iconUrl = (name) => `${assetBase()}/icons/${name}.svg`;
export const ICON_NAMES = ['barrierefrei','breite','chat','farbfaecher','groesse','komfort','lautsprecher-aus','regen','renovierung','schloss','sonderausstattung','sonnenschutz','tablet-handy','taschenrechner','thermostat'];
