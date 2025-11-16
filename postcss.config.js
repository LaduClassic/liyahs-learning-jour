cd /workspaces/spark-template

cat > postcss.config.cjs << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF
