import { Container, getContainer } from "@cloudflare/containers";

export class MyContainer extends Container<Env> {
	defaultPort = 8765;
	sleepAfter = "10m";

	get envVars() {
		return {
			CONTROL_HOST: "0.0.0.0",
			CONTROL_PORT: "8765",
			DISCORD_TOKEN: this.env.DISCORD_TOKEN,
			CLIENT_ID: this.env.CLIENT_ID,
			CONTROL_TOKEN: this.env.CONTROL_TOKEN,
			DISCORD_CLIENT_ID: this.env.CLIENT_ID,
			DISCORD_CLIENT_SECRET: this.env.DISCORD_CLIENT_SECRET,
			BOT_INSTANCE_NAME: "MaowCore",
		};
	}

	override onStart() {
		console.log("MaowCore container started");
	}

	override onError(error: unknown) {
		console.error("MaowCore container error:", error);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const container = getContainer(env.MAOW_CONTAINER);
		return container.fetch(request);
	},

	async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
		const container = getContainer(env.MAOW_CONTAINER);
		await container.fetch(new Request("http://internal/api/health"));
	},
};
