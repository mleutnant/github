// Resolve brand asset URLs. Consumers may set window.SCHMIDT_ASSET_BASE (default "assets").
export const assetBase = () => (typeof window !== 'undefined' && window.SCHMIDT_ASSET_BASE) || 'assets';
export const iconUrl = (name) => `${assetBase()}/icons/${name}.png`;
export const ICON_NAMES = ['barrierefrei','beratung','breite','kosteneffizienz','leichtlaeufig','montage','nullschwelle','profilsystem','regen','schalldaemmung','sicherheit','tablet-handy','thermostat','witterungsschutz','wohnkomfort','zusatzausstattung'];
