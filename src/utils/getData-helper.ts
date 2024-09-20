export const getIconUrl = (icons: chrome.management.IconInfo[] | undefined): string | undefined => {
  return (icons && icons.length) ? icons[icons.length - 1].url : undefined;
};