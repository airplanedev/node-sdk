export type SchemaType = "string" | "float" | "integer" | "boolean" | "date" | "datetime";

export type Schema<T extends SchemaType = SchemaType> = {
  slug: string;
  type: T;
  name: string;
  desc?: string;
  component?: string;
  default?: Value<T>;
  constraints: {
    optional?: boolean;
    regex?: string;
    // options?: Array<Value<T> | ParamLabeledOption<Value<T>>>;
    options?: Array<Value<T>>;
  };
};

type Value<T extends SchemaType> = {
  string: string;
  float: number;
  integer: number;
  boolean: boolean;
  date: Date;
  datetime: Date;
}[T];

type SchemaValue<TSchema extends Schema> = TSchema["constraints"]["optional"] extends false
  ? Value<TSchema["type"]>
  : Value<TSchema["type"]> | undefined;

// type GetValues<TSchemas extends readonly Schema[]> = TSchemas extends [
//   infer TSchema extends Schema,
//   ...infer TRest extends Schema[]
// ]
//   ? [GetValue<TSchema>, ...GetValues<TRest>]
//   : TSchemas extends []
//   ? []
//   : never;

type GetValues<TSchemas extends readonly Schema[]> = {
  [TIndex in keyof TSchemas]: SchemaValue<TSchemas[TIndex]>;
};

type GetValueObject<TSchema extends Schema> = {
  [TProperty in TSchema["slug"]]: SchemaValue<TSchema>;
};

// type Slugs<TSchemas extends readonly Schema[]> = TSchemas[number]["slug"];

type GetValuesObject<TSchemas extends readonly Schema[]> = {
  [TSchema in TSchemas[number] as TSchema["slug"]]: SchemaValue<TSchema>;
};

// const opt = false as boolean;
// type MySchemas = [
//   { slug: "mystring"; type: "string"; constraints: { optional: boolean } },
//   { slug: "mydate"; type: "date"; constraints: { optional: true } },
//   { slug: "myinteger"; type: "integer"; constraints: { optional: false } }
// ];

// let woo: GetValuesObject<MySchemas>;

// type MyValues = GetValues<MySchemas>;
// const foo: GetValueObject<MySchemas[1]> = {
//   foo: 123,
// };
// foo.

// type MyValuesObj = GetValuesObj<MySchemas>;

// type Check<TSchema, TValue> = null;

// export type cases = [AssertTrue<Check<{
//   slug:
// }, "123">>];
