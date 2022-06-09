export class resource {
  identifier: string;

  constructor(identifier: string) {
    this.identifier = identifier;
  }
}

// SQL Resources
export type sql = resource;

export class postgresql extends resource implements sql {}
export class mysql extends resource implements sql {}
export class snowflake extends resource implements sql {}
export class sqlserver extends resource implements sql {}
