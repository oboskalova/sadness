export default {
  displays:[],
  sortingDirectionsDisplays: {
    name: 0,
    typer: 0,
    active: 0,
    updated_at: 1,
    connected_at: 0
  },
  targetDisplayId: 0,
  currentDisplay: {
    name: null,
    pincode: null,
    status: null,
    schedule: null,
    adresses: [],
    adr: 0
  },
  searchingDisplays: false,
  searchDisplayQuery: null,
  searchDisplayResults: [],
  playerLoading: true
}