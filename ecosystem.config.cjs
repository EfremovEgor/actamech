module.exports = {
	apps: [
		{
			name: "actamech",
			script: "dist/server/entry.mjs",
			autorestart: true,
			watch: false,
			env_production: {
				NODE_ENV: "production",
				PORT: 3020,
				NODE_PORT: 3020,
				BODY_SIZE_LIMIT: "Infinity",
				TZ: "Europe/Moscow",
			},
		},
	],
};
