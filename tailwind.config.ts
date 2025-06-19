const config = {
  extend: {
    keyframes: {
      shine: {
        "0%": { backgroundPosition: "200% 0" },
        "25%": { backgroundPosition: "-200% 0" },
        "100%": { backgroundPosition: "-200% 0" },
      },
      gradientFlow: {
        "0%": { "background-position": "0% 50%" },
        "50%": { "background-position": "100% 50%" },
        "100%": { "background-position": "0% 50%" },
      },
      "spinner-leaf-fade": {
        "0%, 100%": { opacity: "0" },
        "50%": { opacity: "1" },
      },
    },
    animation: {
      shine: "shine 3s ease-out infinite",
      "gradient-flow": "gradientFlow 10s ease 0s infinite normal none running",
      "spinner-leaf-fade": "spinner-leaf-fade 800ms linear infinite",
    },
  },
};

export default config;
