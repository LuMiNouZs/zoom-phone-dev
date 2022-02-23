import React from "react";
import { shallow } from "enzyme";
import PhoneTransfer from "./phoneTransfer";

describe("PhoneTransfer", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<PhoneTransfer />);
    expect(wrapper).toMatchSnapshot();
  });
});
