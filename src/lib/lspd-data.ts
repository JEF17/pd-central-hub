export type Priority = "P1" | "P2" | "P3";

export type Call = {
  id: string;
  code: string;
  type: string;
  location: string;
  priority: Priority;
  unit: string;
  elapsed: string;
  status: "dispatched" | "en_route" | "on_scene" | "clear";
};

export const activeCalls: Call[] = [
  {
    id: "CAD-4182",
    code: "10-31",
    type: "Burglary in Progress",
    location: "Strawberry Ave / Carson",
    priority: "P1",
    unit: "3-ADAM-12",
    elapsed: "02:15",
    status: "en_route",
  },
  {
    id: "CAD-4181",
    code: "211S",
    type: "Silent Alarm — Bank",
    location: "Maze Bank West, Del Perro",
    priority: "P1",
    unit: "1-LINCOLN-20",
    elapsed: "06:48",
    status: "on_scene",
  },
  {
    id: "CAD-4179",
    code: "10-71",
    type: "Suspicious Vehicle",
    location: "Del Perro Pier, Lot 4",
    priority: "P2",
    unit: "2-KING-05",
    elapsed: "08:44",
    status: "dispatched",
  },
  {
    id: "CAD-4176",
    code: "502",
    type: "Traffic Stop",
    location: "Greenwich Pkwy / Alta",
    priority: "P3",
    unit: "3-XRAY-14",
    elapsed: "14:12",
    status: "on_scene",
  },
  {
    id: "CAD-4170",
    code: "10-12",
    type: "Standby for Escort",
    location: "LS International, Gate 2",
    priority: "P3",
    unit: "AIR-2",
    elapsed: "22:03",
    status: "clear",
  },
];

export const priorityCall = {
  code: "10-99",
  title: "Officer Emergency — Shots Fired",
  detail:
    "Multiple rounds discharged at 4122 Power St, Vespucci. All units in vicinity respond Code 3.",
  units: ["3-ADAM-12", "1-LINCOLN-20", "K9-1"],
};

export type Unit = {
  callsign: string;
  officers: string;
  status: "available" | "assigned" | "out_of_service";
  sector: string;
};

export const units: Unit[] = [
  { callsign: "1-LINCOLN-20", officers: "Miller / Soto", status: "assigned", sector: "Sector 4" },
  { callsign: "2-KING-05", officers: "Det. Vaughn", status: "assigned", sector: "Sector 2" },
  { callsign: "3-ADAM-12", officers: "Rodriguez / Chen", status: "assigned", sector: "Sector 4" },
  { callsign: "3-XRAY-14", officers: "Okafor", status: "assigned", sector: "Sector 1" },
  { callsign: "K9-1", officers: "Hale / K9 Rex", status: "available", sector: "Citywide" },
  { callsign: "AIR-2", officers: "Air Support", status: "out_of_service", sector: "Citywide" },
  { callsign: "5-BOY-11", officers: "Petrov / Grant", status: "available", sector: "Sector 3" },
  { callsign: "6-MARY-08", officers: "Nakamura", status: "available", sector: "Sector 5" },
];

export const bulletins = [
  {
    title: "Shift Supervisor Note",
    body: "Increased gang activity reported in Chamberlain Hills. All patrols maintain high vigilance through nightwatch.",
    level: "warning" as const,
    time: "17:42",
  },
  {
    title: "Equipment Maintenance",
    body: "Motorpool Bay 3 closed for floor resurfacing until Friday 0800 hrs. Stage vehicles in the north lot.",
    level: "info" as const,
    time: "14:05",
  },
  {
    title: "Mandatory Briefing",
    body: "Gang Impact Team briefing at 18:00 in the Mission Row roll-call room. Attendance recorded.",
    level: "info" as const,
    time: "09:30",
  },
];

export const bolos = [
  {
    name: "Marcus Vane",
    description: "Wanted for multiple narcotics trafficking charges. Last seen in Rancho.",
    priority: "Medium",
  },
  {
    name: "Unidentified Male, 30s",
    description: "Black Comet, tinted windows. Considered armed and dangerous.",
    priority: "High",
  },
];

export const personnel = [
  { badge: "3812", name: "Sgt. J. Reed", rank: "Sergeant", division: "Patrol", status: "On Duty" },
  { badge: "4471", name: "Off. A. Rodriguez", rank: "Officer II", division: "Patrol", status: "On Duty" },
  { badge: "2290", name: "Det. L. Vaughn", rank: "Detective II", division: "Robbery-Homicide", status: "On Duty" },
  { badge: "5108", name: "Off. M. Chen", rank: "Officer I", division: "Patrol", status: "On Duty" },
  { badge: "1937", name: "Lt. D. Okafor", rank: "Lieutenant", division: "Gang Impact", status: "Off Duty" },
  { badge: "6624", name: "Off. K. Hale", rank: "Officer II", division: "K9", status: "On Duty" },
  { badge: "7015", name: "Off. S. Nakamura", rank: "Officer I", division: "Traffic", status: "On Duty" },
];

export const records = [
  { id: "IR-2041", type: "Armed Robbery", location: "Mission Row Store", officer: "Sgt. J. Reed", status: "In Progress", date: "24 May" },
  { id: "IR-2040", type: "Grand Theft Auto", location: "Vespucci Beach", officer: "Off. A. Rodriguez", status: "Resolved", date: "24 May" },
  { id: "IR-2039", type: "Public Intoxication", location: "Legion Square", officer: "Off. M. Chen", status: "Closed", date: "23 May" },
  { id: "IR-2038", type: "Aggravated Assault", location: "Chamberlain Hills", officer: "Det. L. Vaughn", status: "In Progress", date: "23 May" },
  { id: "IR-2037", type: "Narcotics Possession", location: "Grove St", officer: "Off. K. Hale", status: "Resolved", date: "22 May" },
];

export const stats = [
  { label: "Active Calls", value: "5", note: "2 priority one" },
  { label: "Units Available", value: "14 / 22", note: "Citywide" },
  { label: "Avg. Response", value: "4.2 min", note: "-0.5 vs. yesterday" },
  { label: "Open Warrants", value: "28", note: "3 issued today", warn: true },
];

export const callsByDay: { day: string; calls: number }[] = [
  { day: "Mon", calls: 42 },
  { day: "Tue", calls: 38 },
  { day: "Wed", calls: 51 },
  { day: "Thu", calls: 47 },
  { day: "Fri", calls: 66 },
  { day: "Sat", calls: 78 },
  { day: "Sun", calls: 59 },
];

export const responseTrend: { day: string; minutes: number }[] = [
  { day: "Mon", minutes: 5.1 },
  { day: "Tue", minutes: 4.8 },
  { day: "Wed", minutes: 5.4 },
  { day: "Thu", minutes: 4.6 },
  { day: "Fri", minutes: 4.9 },
  { day: "Sat", minutes: 5.8 },
  { day: "Sun", minutes: 4.2 },
];

export const callTypeBreakdown: { type: string; value: number }[] = [
  { type: "Traffic", value: 34 },
  { type: "Property crime", value: 24 },
  { type: "Violent crime", value: 16 },
  { type: "Public order", value: 15 },
  { type: "Other", value: 11 },
];

