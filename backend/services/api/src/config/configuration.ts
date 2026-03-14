export interface AppConfiguration {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export default (): AppConfiguration => ({
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m"
});
