
const verticalOffset = {
  screenLength: 600,
  maxWorldLength: 5000,
  minWorldLength: 1000,
};

function getSiteIcon(icon) {
  return {
    type: "point-3d",
    symbolLayers: [
      {
        type: "icon",
        resource: {
          href: icon,
        },
        size: 30,
        outline: {
          color: "red",
          size: 2,
        },
      },
    ],
    verticalOffset: verticalOffset,
    callout: {
      type: "line",
      color: [0, 0, 0],
      size: 1.5,
      border: {
        color: [0, 0, 0],
      },
    },
  };
}

// Choose one default icon for the simple renderer
const cityRenderer = {
  type: "simple",
  symbol: getSiteIcon("assets/icons/Newspaper_Circle.png"),
};
