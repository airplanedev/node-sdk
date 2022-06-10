export class Base {
  identifier: string;

  constructor(identifier: string) {
    this.identifier = identifier;
  }
}

// SQL Resources
export class PostgreSQLResource extends Base {}
export class MySQLResource extends Base {}
export class SnowflakeResource extends Base {}
export class MicrosoftSQLServerResource extends Base {}

export type SQLResource =
  | PostgreSQLResource
  | MySQLResource
  | SnowflakeResource
  | MicrosoftSQLServerResource;

export default {
  PostgreSQLResource,
  MySQLResource,
  SnowflakeResource,
  MicrosoftSQLServerResource,
};
