import { Endb } from "../src";
import { clearEach, apiTest, valueTest } from "@endb/test";

describe("endb", () => {
  beforeEach(() => clearEach(Endb));

  test("should be a class", () => {
    expect(typeof Endb).toBe("function");
    // @ts-ignore
    expect(() => Endb()).toThrowError();
    expect(() => new Endb()).not.toThrowError();
  });

  test("should integrate the adapter provided", async () => {
    const store = new Map() as Map<string, string> & { namespace: string };
    const endb = new Endb({ store });
    expect(store.size).toBe(0);
    await endb.set("foo", "bar");
    expect(await endb.get("foo")).toBe("bar");
    expect(store.size).toBe(1);
  });

  test("should integrate custom serializers provided", async () => {
    const serialize = JSON.stringify;
    const deserialize = JSON.parse;
    const endb = new Endb({ serialize, deserialize });
    await endb.set("foo", "bar");
    expect(await endb.get("foo")).toBe("bar");
  });

  describe("API", () => {
    apiTest(test, Endb);
  });

  describe("value", () => {
    valueTest(test, Endb);
  });

  afterEach(() => clearEach(Endb));
});
