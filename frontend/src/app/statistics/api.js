import { getData } from "../../lib/fetchData";

export const getAllPlacementYears = () => getData("/api/placements");
