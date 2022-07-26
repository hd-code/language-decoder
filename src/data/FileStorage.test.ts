import * as assert from "assert/strict";
import * as fs from "fs";
import * as path from "path";
import { FileStorage } from "./FileStorage";

describe(FileStorage.name, () => {
    const filepath = path.join(__dirname, "__filestorage__baiUhs.tmp.json");
    const cleanUp = () => {
        try {
            fs.rmSync(filepath);
        } catch (err) {
            if (err.code !== "ENOENT") {
                throw err;
            }
        }
    };

    describe("init", () => {
        after(cleanUp);
        before(cleanUp);

        it("should throw error if not exists", async () => {
            const fileStore = new FileStorage();
            let gotErr = false;

            try {
                await fileStore.init(filepath, false);
            } catch (err) {
                gotErr = true;
            }

            assert.ok(gotErr, "expected an error");
        });

        it("should create file if not exists", async () => {
            const fileStore = new FileStorage();
            await fileStore.init(filepath);
            const content = fs.readFileSync(filepath).toString();
            assert.deepEqual(JSON.parse(content), {});
        });

        it("should load file", async () => {
            const obj = { hello: "world" };
            fs.writeFileSync(filepath, JSON.stringify(obj));

            const fileStore = new FileStorage();
            await fileStore.init(filepath);

            assert.equal(fileStore.get("hello"), "world");
            assert.equal(fileStore.get("hellos"), null);
        });

        it("should fail when the file is not json", async () => {
            fs.writeFileSync(filepath, "Broken}File");

            const fileStore = new FileStorage();
            let gotErr = false;

            try {
                await fileStore.init(filepath, false);
            } catch (err) {
                gotErr = true;
            }

            assert.ok(gotErr, "expected an error");
        });
    });

    describe("set", () => {
        const initialObj = { test: "Hello World" };
        const fileStore = new FileStorage();

        before(async () => {
            fs.writeFileSync(filepath, JSON.stringify(initialObj));
            await fileStore.init(filepath);
        });
        after(cleanUp);

        it("should set value into class instance", () => {
            fileStore.set("hello", "world");
            assert.equal(fileStore.get("hello"), "world");
        });

        it("file should be altered now", async () => {
            await sleep(100);
            const buffer = fs.readFileSync(filepath);
            const data = JSON.parse(buffer.toString());
            assert.equal(data["hello"], "world");
        });
    });

    describe("get", () => {
        const data = { test: "Hello World", test2: "foo" };
        const fileStore = new FileStorage();

        before(async () => {
            fs.writeFileSync(filepath, JSON.stringify(data));
            await fileStore.init(filepath);
        });
        after(cleanUp);

        it("should get correct value for test", () => {
            const got = fileStore.get("test");
            assert.equal(got, "Hello World");
        });

        it("should return null for unknown key", () => {
            const got = fileStore.get("test_ghjt");
            assert.equal(got, null);
        });

        it("should get previous set value", async () => {
            const key = "test_ghjt";
            const value = "nvudncsduhb";
            const got = fileStore.get(key);
            assert.equal(got, null);

            await fileStore.set(key, value);
            const got2 = fileStore.get(key);
            assert.equal(got2, value);
        });
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
