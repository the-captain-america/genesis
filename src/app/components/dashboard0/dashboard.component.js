import template from "./dashboard.html";
import DashboardController from "./dashboard.controller";

const bindings = {};

let DashboardComponent = {
  bindings,
  template,
  templateAs: "$ctrl",
  controller: DashboardController
};

export default DashboardComponent;
