import { checkEmptyStr, getDate } from "./index";
const mockDate = () => {
  const currentDate = new Date("2020-01-29T19:57:00.135");
  //@ts-ignore
  global.Date = class extends Date {
    constructor(date: string | number | Date) {
      if (date) {
        //@ts-ignore
        return super(date);
      }
      return currentDate;
    }
  };
};
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
describe("getDate()", () => {
  it("should return current date and time in desired format", () => {
    mockDate();
    const noParamsGetDate = getDate();
    expect(noParamsGetDate.date).toBe("29 Jan, 2020");
    expect(noParamsGetDate.time).toBe("19:57");
  });
  it("should return desired date and time in desired format", () => {
    mockDate();
    const withParamsGetDate = getDate(new Date("2020-01-01T00:10:00.135"));
    expect(withParamsGetDate.date).toBe("1 Jan, 2020");
    expect(withParamsGetDate.time).toBe("00:10");
  });
});
