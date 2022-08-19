import { Point } from "./point";

// Port data format
export interface Port {
  // Port's name (just for illustrative purposes)
  name: string;
  // Breadcrumb points — describes how to sail the narrow parts of the path from the port
  breadcrumbs: Point[];
}

// List of ports to work with
export const ports: Port[] = [
  {
    name: "Hirtshals, Denmark",
    breadcrumbs: [
      new Point(57.592841, 9.966922),
      new Point(57.595534, 9.963483),
      new Point(57.597369, 9.958817),
      new Point(57.599751, 9.958033),
      new Point(57.601585, 9.956994),
    ],
  },
  {
    name: "Kristiansand, Norway",
    breadcrumbs: [
      new Point(58.144044, 7.985321),
      new Point(58.14229, 7.98688),
      new Point(58.140142, 7.98738),
      new Point(58.133968, 7.988785),
      new Point(58.128519, 8.001452),
      new Point(58.125508, 8.008597),
      new Point(58.117212, 8.017392),
      new Point(58.09778, 8.037732),
      new Point(58.076788, 8.060878),
      new Point(58.041643, 8.108352),
    ],
  },
  {
    name: "Larvik, Norway",
    breadcrumbs: [
      new Point(59.041698, 10.045262),
      new Point(59.040981, 10.042309),
      new Point(59.038086, 10.03398),
      new Point(59.035695, 10.033933),
      new Point(59.025676, 10.041152),
      new Point(59.01797, 10.04746),
      new Point(59.001897, 10.066968),
      new Point(58.993137, 10.091842),
      new Point(58.972646, 10.095421),
    ],
  },
];
