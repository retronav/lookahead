import { checkEmptyStr, ISOToReadableDate } from "./index";
describe("checkEmptyStr()", () => {
  it("Should return true for ''", () => {
    expect(checkEmptyStr("")).toBe(true);
  });
  it("Should return true for '      '", () => {
    expect(checkEmptyStr("      ")).toBe(true);
  });
  it("Should return false for 'foobar'", () => {
    expect(checkEmptyStr("foobar")).toBe(false);
  });
});
describe("ISOToReadableDate()", () => {
  it("2020-12-20T12:36:05.966Z to readable date", () => {
    ISOToReadableDate("2020-12-20T12:36:05.966Z");
  });
});
