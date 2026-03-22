export function composeDbUrl({
  dbProtocol = "postgresql",
  dbHost,
  dbPort,
  dbDatabase,
  dbUsername,
  dbPassword,
}: {
  dbProtocol: string;
  dbHost: string;
  dbPort: number;
  dbDatabase: string;
  dbUsername: string;
  dbPassword: string;
}) {
  return `${dbProtocol}://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;
}
